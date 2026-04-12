import { NextResponse } from "next/server";
import { getAllFrameworks } from "@/app/(admin)/frameworks/action";

export async function GET() {
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

