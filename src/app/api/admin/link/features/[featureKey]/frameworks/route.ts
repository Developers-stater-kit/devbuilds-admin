import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

type RouteContext = {
  params: Promise<{ featureKey: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { featureKey } = await context.params;
    // Calls your Node backend link service
    const data = await fetchBackend(`/api/admin/link/features/${featureKey}/frameworks`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}