"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth"; // Adjust path to your BetterAuth instance
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import sharp from "sharp";



const BUCKET_NAME = "Devbuilds-media";

/**
 * Security middleware to check if the user is an admin via BetterAuth
 */
async function validateAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if session exists and user has the admin role
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  
  return session;
}

/**
 * Uploads an asset using the Service Role Key
 */
export async function uploadAssetAction(formData: FormData, customName: string) {
  try {
    await validateAdmin();

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = "webp"; // We'll convert everything to WebP for best compression
    const cleanName = customName.trim().replace(/\s+/g, "-").toLowerCase();
    const path = `${cleanName}.${fileExtension}`;

    // --- COMPRESSION LOGIC START ---
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true }) // Cap width at 1920px
      .webp({ quality: 80 }) // Convert to WebP at 80% quality
      .toBuffer();
    // --- COMPRESSION LOGIC END ---

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(path, optimizedBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) throw error;

    revalidatePath("/assets");
    return { success: true, path: data.path };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an asset using the Service Role Key
 */
export async function deleteAssetAction(path: string) {
  try {
    await validateAdmin();

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;

    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Action Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Lists all assets (Server-side fetching)
 */
export async function listAssetsAction() {
  try {
    // We validate admin even for listing to protect your asset library metadata
    await validateAdmin();

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list("", {
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) throw error;

    const assets = data
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);

        return {
          ...file,
          publicUrl,
          path: file.name,
        };
      });

    return { success: true, assets };
  } catch (error: any) {
    console.error("List Action Error:", error.message);
    return { success: false, error: error.message, assets: [] };
  }
}