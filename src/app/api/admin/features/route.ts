import { NextResponse } from "next/server";
import { getAllFeatures } from "@/app/(admin)/features/action";

export async function GET() {
  try {
    const data = await getAllFeatures();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}