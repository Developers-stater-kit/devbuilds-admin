"use server";

import { db } from "@/db/drizzle";
import { features } from "@/db/schema/resources";
import { eq } from "drizzle-orm";


export interface getAllFeaturesResponse {
    success: boolean;
    data: typeof features.$inferSelect[] | null;
    error?: string;
}

export const getAllFeatures = async (): Promise<getAllFeaturesResponse> => {
    try {
        const res = await db.select().from(features);

        return {
            success: true,
            data: res,
        };

    } catch (error) {
        console.error("Error fetching features:", error);
        return {
            success: false,
            data: null,
            error: "Failed to fetch features",
        };
    }
}


type Response = {
    success: boolean;
    mssg: string;
    data: string | null;
};


export async function createFeatures({ data }: { data: typeof features.$inferInsert }): Promise<Response> {
    try {
        const [newfeatures] = await db
            .insert(features)
            .values({
                name: data.name,
                uniqueKey: data.uniqueKey,
                featureType: data.featureType,
                repoName: data.repoName,
                status: data.status ?? "PENDING",
                isExperimental: data.isExperimental
            })
            .returning({ id: features.id });

        if (!newfeatures || !newfeatures.id) {
            return {
                success: false,
                mssg: "Feature creation failed.",
                data: null,
            };
        }

        return {
            success: true,
            mssg: "Feature created successfully",
            data: newfeatures.id,
        };
    } catch (error) {
        console.error("Error creating Feature:", error);
        return {
            success: false,
            mssg: "Error creating Feature.",
            data: null,
        };
    }
}

export async function deleteFeature(id: string): Promise<Response> {
    try {
        const [deletedFeature] = await db
            .delete(features)
            .where(eq(features.id, id))
            .returning({ id: features.id });

        if (!deletedFeature) {
            return {
                success: false,
                mssg: "Feature not found or already deleted.",
                data: null,
            };
        }

        return {
            success: true,
            mssg: "Feature deleted successfully.",
            data: deletedFeature.id,
        };
    } catch (error) {
        console.error("Error deleting feature:", error);
        return {
            success: false,
            mssg: "Error occurred while deleting the feature.",
            data: null,
        };
    }
}

type FeatureResponse = {
    success: boolean;
    mssg: string;
    data: typeof features.$inferSelect | null;
};

export async function getFeatureById(id: string): Promise<FeatureResponse> {
    try {
        const [feature] = await db
            .select()
            .from(features)
            .where(eq(features.id, id))
            .limit(1);

        if (!feature) {
            return { success: false, mssg: "Feature not found.", data: null };
        }

        return { success: true, mssg: "Feature fetched successfully", data: feature };
    } catch (error) {
        console.error("Error fetching feature:", error);
        return { success: false, mssg: "Error fetching feature", data: null };
    }
}

export async function updateFeature(id: string, data: Partial<typeof features.$inferInsert>): Promise<FeatureResponse> {
    try {
        const [updated] = await db
            .update(features)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(features.id, id))
            .returning();

        if (!updated) {
            return { success: false, mssg: "Feature not found.", data: null };
        }

        return { success: true, mssg: "Feature updated successfully", data: updated };
    } catch (error) {
        console.error("Error updating feature:", error);
        return { success: false, mssg: "Error updating feature", data: null };
    }
}