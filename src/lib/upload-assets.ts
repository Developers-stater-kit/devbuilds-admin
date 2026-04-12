import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { createSupabaseClient } from "@/lib/supabase";

const supabase = createSupabaseClient();

type UploadProps = {
  file: File;
  bucket?: string;
  customName?: string; // Renamed for clarity
};

export const uploadImage = async ({ 
  file, 
  bucket = "Devbuilds-media", 
  customName 
}: UploadProps) => {
  const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
  
  // Create a URL-friendly name: "My Image" -> "my-image"
  const cleanName = customName 
    ? customName.trim().replace(/\s+/g, '-').toLowerCase() 
    : uuidv4();
    
  // Fixed path: Placing the name directly at the root
  const path = `${cleanName}.${fileExtension}`;

  try {
    if (file.size > 1024 * 1024) {
      file = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });
    }
  } catch (error) {
    console.error("Compression error:", error);
  }

  const { data, error } = await supabase.storage.from(bucket).upload(path, file);

  if (error) {
    console.error("Upload error:", error);
    return { imageUrl: "", error: error.message, path: "" };
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { imageUrl: publicUrl, error: null, path: data.path };
};

export const deleteImage = async (path: string, bucket = "Devbuilds-media") => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { error: error.message };
  return { data, error: null };
};

export const listAssets = async (bucket = "Devbuilds-media", folder = "") => {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) return { assets: [], error: error.message };
  if (!data) return { assets: [], error: null };

  const assets = data
    .filter(file => file.name !== ".emptyFolderPlaceholder")
    .map(file => {
      const filePath = folder ? `${folder}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return {
        ...file,
        publicUrl,
        path: filePath
      };
    });

  return { assets, error: null };
};