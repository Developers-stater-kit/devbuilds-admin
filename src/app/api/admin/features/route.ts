import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";
import { getAllFeatures } from "@/app/(admin)/features/action";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // fetchBackend returns the DATA, not the response object
    const data = await getAllFeatures();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}