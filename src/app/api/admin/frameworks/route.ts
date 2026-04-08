import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // fetchBackend already returns the parsed JSON data
    const data = await fetchBackend(`/api/admin/frameworks?${searchParams.toString()}`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Frameworks GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    // fetchBackend already handles JSON.stringify(body) internally
    const data = await fetchBackend("/api/admin/frameworks/create", {
      method: "POST",
      body: body,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Frameworks POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}