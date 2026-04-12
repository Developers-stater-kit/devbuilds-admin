"use server";

import { db } from "@/db/drizzle";
import { features, frameworkFeatures, frameworks } from "@/db/schema/resources";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export type RelationActionResponse<T = any> = {
    success: boolean;
    data: T | null;
    error?: string;
    message?: string;
}


export async function linkFeatureToFramework(frameworkKey: string, featureKey: string): Promise<RelationActionResponse> {
    try {
        if (!frameworkKey || !featureKey) {
            throw new Error("Framework or Feature key missing");
        };

        const [framework] = await db
            .select({ id: frameworks.id })
            .from(frameworks)
            .where(eq(frameworks.uniqueKey, frameworkKey))
            .limit(1);
        if (!framework?.id) {
            return {
                success: false,
                message: "Framework Not Found",
                error: "Framework Not Found",
                data: null
            }
        };

        const [feature] = await db
            .select({ id: features.id })
            .from(features)
            .where(eq(features.uniqueKey, featureKey))
            .limit(1);
        if (!feature?.id) {
            return {
                success: false,
                message: "Feature Not Found",
                error: "Feature Not Found",
                data: null
            }
        };

        const result = await db
            .insert(frameworkFeatures)
            .values({
                frameworkId: framework.id,
                featureId: feature.id,
            })
            .returning();

        revalidatePath("/relations");

        return {
            success: true,
            message: "Feature Linked Successfully to Framework",
            data: result[0]
        }

    } catch (error: any) {
        if (error.code === "23505" || error.message.includes("uniqueFrameworkFeature")) {
            return {
                success: false,
                message: "This feature is already linked to this framework",
                error: "Duplicate link",
                data: null,
            };
        }
        return {
            success: false,
            message: `Error: ${error.message}`,
            error: error.message,
            data: null,
        };
    }
}

export async function getFeaturesForFramework(frameworkKey: string): Promise<RelationActionResponse<typeof features.$inferSelect[]>> {
    try {
        const [framework] = await db
            .select({ id: frameworks.id })
            .from(frameworks)
            .where(eq(frameworks.uniqueKey, frameworkKey))
            .limit(1);

        if (!framework?.id) return { success: false, error: "Framework Not Found", data: [] };

        const result = await db
            .select({ feature: features })
            .from(frameworkFeatures)
            .innerJoin(features, eq(frameworkFeatures.featureId, features.id))
            .where(eq(frameworkFeatures.frameworkId, framework.id));

        return { success: true, message: "Features fetched successfully", data: result.map(r => r.feature) };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}

export async function getFrameworksForFeature(featureKey: string): Promise<RelationActionResponse<typeof frameworks.$inferSelect[]>> {
    try {
        const [feature] = await db
            .select({ id: features.id })
            .from(features)
            .where(eq(features.uniqueKey, featureKey))
            .limit(1);

        if (!feature?.id) return { success: false, error: "Feature Not Found", data: [] };

        const result = await db
            .select({ framework: frameworks })
            .from(frameworkFeatures)
            .innerJoin(frameworks, eq(frameworkFeatures.frameworkId, frameworks.id))
            .where(eq(frameworkFeatures.featureId, feature.id));

        return { success: true, message: "Frameworks fetched successfully", data: result.map(r => r.framework) };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}

export async function unlinkFeatureFromFramework(frameworkKey: string, featureKey: string): Promise<RelationActionResponse> {
    try {
        const [framework] = await db
            .select({ id: frameworks.id })
            .from(frameworks)
            .where(eq(frameworks.uniqueKey, frameworkKey))
            .limit(1);

        const [feature] = await db
            .select({ id: features.id })
            .from(features)
            .where(eq(features.uniqueKey, featureKey))
            .limit(1);

        if (!framework?.id || !feature?.id) {
            return { success: false, error: "Framework or Feature Not Found", data: null };
        }


        const result = await db
            .delete(frameworkFeatures)
            .where(and(eq(frameworkFeatures.frameworkId, framework.id), eq(frameworkFeatures.featureId, feature.id)))
            .returning();

        revalidatePath("/relations");

        return { success: true, message: "Feature unlinked from framework successfully", data: result };
    } catch (error: any) {
        return { success: false, error: error.message, data: null };
    }
}