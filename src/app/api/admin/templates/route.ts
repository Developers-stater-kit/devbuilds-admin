import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";
import { getAllTemplates } from "@/app/(admin)/templates/action";

export async function GET() {
  try {
    const response = await getAllTemplates();

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Templates API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
