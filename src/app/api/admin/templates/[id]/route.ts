import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";
import { getTemplateById } from "@/app/(admin)/templates/action";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getTemplateById(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
