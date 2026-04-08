import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

export async function GET() {
    try {
        const data = await fetchBackend("/api/admin/stats");
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch stats" },
            { status: 500 }
        );
    }
}