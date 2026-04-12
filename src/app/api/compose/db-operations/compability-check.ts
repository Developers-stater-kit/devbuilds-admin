import { and, eq } from "drizzle-orm";
import { isFeatureCompatibleWithFramework } from "./repository";
import { db } from "@/db/drizzle";
import { features, frameworks } from "@/db/schema/resources";

type Response = {
    success: boolean,
    mssg: string,
}

export async function compabilityCheck(framweorkKey: string, featureKey: string): Promise<Response> {
    try {
        if (!framweorkKey || !featureKey) {
            throw new Error("Keys Not Found");
        };
        const [framework] = await db
            .select({ id: frameworks.id })
            .from(frameworks)
            .where(eq(frameworks.uniqueKey, framweorkKey))
            .limit(1);
        if (!framework?.id) {
            return {
                success: false,
                mssg: "Framework Not Found",
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
                mssg: "Feature Not Found",
            }
        };

        const result = await isFeatureCompatibleWithFramework(
            framework.id,
            feature.id
        )


        if (!result) {
            return {
                success: false,
                mssg: "Incompatible",
            };
        }

        return {
            success: true,
            mssg: "Compatible ",
        };
    } catch (error: any) {
        return {
            success: false,
            mssg: `System Error: ${error.message.split('\n')[0]}`,
        };
    }
}