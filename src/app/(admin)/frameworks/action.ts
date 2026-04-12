"use server";

import { db } from "@/db/drizzle";
import { frameworks } from "@/db/schema/resources";
import { eq } from "drizzle-orm";


export interface GetAllFrameworksResponse {
    success: boolean;
    data: typeof frameworks.$inferSelect[] | null;
    error?: string;
}

export const getAllFrameworks = async (): Promise<GetAllFrameworksResponse> => {
    try {
        const res = await db.select().from(frameworks);

        return {
            success: true,
            data: res,
        };

    } catch (error) {
        console.error("Error fetching frameworks:", error);
        return {
            success: false,
            data: null,
            error: "Failed to fetch templates",
        };
    }
}

type Response = {
    success: boolean;
    mssg: string;
    data: string | null;
};

export async function createFramework({ data }: { data: typeof frameworks.$inferInsert }): Promise<Response> {
    try {

        const [existing] = await db
            .select()
            .from(frameworks)
            .where(eq(frameworks.uniqueKey, data.uniqueKey))
            .limit(1);

        if (existing) {
            return {
                success: false,
                mssg: `Framework with key '${data.name}' already exists.`,
                data: null,
            };
        }

        const [newFramework] = await db
            .insert(frameworks)
            .values({
                name: data.name,
                uniqueKey: data.uniqueKey,
                repoName: data.repoName,
                scope: data.scope,
                status: data.status ?? "PENDING",
                isExperimental: data.isExperimental ?? false
            })
            .returning({ id: frameworks.id });

        if (!newFramework || !newFramework.id) {
            return {
                success: false,
                mssg: "Framework creation failed.",
                data: null,
            };
        }

        return {
            success: true,
            mssg: "Framework created successfully",
            data: newFramework.id,
        };
    } catch (error) {
        console.error("Error creating framework:", error);
        return {
            success: false,
            mssg: "Error creating framework.",
            data: null,
        };
    }
}


export async function deleteFramework(id: string): Promise<Response> {
    try {
        const [deleted] = await db
            .delete(frameworks)
            .where(eq(frameworks.id, id))
            .returning({ id: frameworks.id });

        if (!deleted) {
            return { success: false, mssg: "Framework not found.", data: null };
        }

        return {
            success: true,
            mssg: "Framework deleted successfully.",
            data: deleted.id
        };
    } catch (error) {
        console.error("Error deleting framework:", error);
        return { success: false, mssg: "Error deleting framework.", data: null };
    }
}

type FrameworkResponse = {
    success: boolean;
    mssg: string;
    data: typeof frameworks.$inferSelect | null;
};

export async function getFrameworkById(id: string): Promise<FrameworkResponse> {
    try {
        const [framework] = await db
            .select()
            .from(frameworks)
            .where(eq(frameworks.id, id))
            .limit(1);

        if (!framework) {
            return { success: false, mssg: "Framework not found.", data: null };
        }

        return { success: true, mssg: "Framework fetched successfully", data: framework };
    } catch (error) {
        console.error("Error fetching framework:", error);
        return { success: false, mssg: "Error fetching framework", data: null };
    }
}

export async function updateFramework(id: string, data: Partial<typeof frameworks.$inferInsert>): Promise<FrameworkResponse> {
    try {
        const [updated] = await db
            .update(frameworks)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(frameworks.id, id))
            .returning();

        if (!updated) {
            return { success: false, mssg: "Framework not found.", data: null };
        }

        return { success: true, mssg: "Framework updated successfully", data: updated };
    } catch (error) {
        console.error("Error updating framework:", error);
        return { success: false, mssg: "Error updating framework", data: null };
    }
}
