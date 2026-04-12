import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";
import { getAllFrameworks } from "@/app/(admin)/frameworks/action";

export async function GET(request: Request) {
  try {
    const data = await getAllFrameworks();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Frameworks GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

