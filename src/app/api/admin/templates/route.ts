import { getTemplates } from "@/app/(admin)/templates/action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Check for the 'featured' query param
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get("featured") === "true";

    // 2. Call the unified function
    const response = await getTemplates(isFeatured);

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}