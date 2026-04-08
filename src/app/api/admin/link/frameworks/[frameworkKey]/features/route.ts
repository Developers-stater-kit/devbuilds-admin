import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

type RouteContext = {
  params: Promise<{ frameworkKey: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { frameworkKey } = await context.params;
    // Calls your Node backend link service
    const data = await fetchBackend(`/api/admin/link/frameworks/${frameworkKey}/features`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}