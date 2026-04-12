"use server";

import { db } from "@/db/drizzle";
import { features, frameworks } from "@/db/schema/resources";
import { templates } from "@/db/schema/templates/templates";
import { count } from "drizzle-orm";



type Response = {
    success: boolean;
    mssg: string;
    data: {
        frameworks: number,
        features: number,
        templates: number
    };
};


export async function getAllStats(): Promise<Response> {
    try {
        // Fetch all counts in parallel
        const [fwResult, ftResult, tmResult] = await Promise.all([
            db.select({ value: count() }).from(frameworks),
            db.select({ value: count() }).from(features),
            db.select({ value: count() }).from(templates),
        ]);

        const stats = {
            frameworks: fwResult[0].value,
            features: ftResult[0].value,
            templates: tmResult[0].value,
        };

        return {
            success: true,
            mssg: "Stats fetched successfully",
            data: stats
        };
    } catch (error: any) {
        return {
            success: false,
            mssg: `Error fetching stats: ${error.message}`,
            data: { frameworks: 0, features: 0, templates: 0 }
        };
    }
}