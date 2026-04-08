import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const data = await fetchBackend(`/api/templates`);

    console.log(data)
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Templates GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Pass the body object directly; fetchBackend handles stringifying
    const data = await fetchBackend("/api/templates/create", {
      method: "POST",
      body: body, 
    });
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Templates POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}