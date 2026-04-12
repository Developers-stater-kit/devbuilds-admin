import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";
import { getFeatureById } from "@/app/(admin)/features/action";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getFeatureById(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}