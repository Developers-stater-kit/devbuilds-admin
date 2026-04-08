import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // fetchBackend returns the DATA, not the response object
    const data = await fetchBackend(`/api/admin/features?${searchParams.toString()}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fetchBackend("/api/admin/features/create", {
      method: "POST",
      body: body, // fetchBackend already does JSON.stringify
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}