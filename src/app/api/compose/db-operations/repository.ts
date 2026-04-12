import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { features, frameworkFeatures, frameworks } from "@/db/schema/resources";

type Response = {
    success: boolean;
    mssg: string;
    data: any;
};

/**
 * Fetch framework by uniqueKey
 */
export async function getFrameworkByKey(
    uniqueKey: string
): Promise<Response> {
    try {
        const result = await db
            .select()
            .from(frameworks)
            .where(
                and(
                    eq(frameworks.uniqueKey, uniqueKey),
                    eq(frameworks.status, "ACTIVE")
                )
            )
            .limit(1);

        if (!result || result.length === 0) {
            return {
                success: false,
                mssg: "Framework not found.",
                data: null,
            };
        }

        return {
            success: true,
            mssg: "Framework fetched successfully.",
            data: result[0],
        };
    } catch (error) {
        console.error("Error fetching framework by key:", error);
        return {
            success: false,
            mssg: "Error fetching framework using key.",
            data: null,
        };
    }
}

/**
 * Fetch feature by uniqueKey
 */
export async function getFeatureByKey(
    uniqueKey: string
): Promise<Response> {
    try {
        const result = await db
            .select()
            .from(features)
            .where(
                and(
                    eq(features.uniqueKey, uniqueKey),
                    eq(features.status, "ACTIVE")
                )
            )
            .limit(1);

        if (!result || result.length === 0) {
            return {
                success: false,
                mssg: "Feature not found.",
                data: null,
            };
        }

        return {
            success: true,
            mssg: "Feature fetched successfully.",
            data: result[0],
        };
    } catch (error) {
        console.error("Error fetching feature by key:", error);
        return {
            success: false,
            mssg: "Error fetching feature by key.",
            data: null,
        };
    }
}

/**
 * Check if feature is compatible with framework
 */
export async function isFeatureCompatibleWithFramework(
    frameworkId: string,
    featureId: string
): Promise<boolean> {
    try {
        const result = await db
            .select()
            .from(frameworkFeatures)
            .where(
                and(
                    eq(frameworkFeatures.frameworkId, frameworkId),
                    eq(frameworkFeatures.featureId, featureId)
                )
            )
            .limit(1);

        return !!(result && result.length > 0);
    } catch (error) {
        console.error("Error checking if feature is compatible with framework:", error);
        return false;
    }
}
