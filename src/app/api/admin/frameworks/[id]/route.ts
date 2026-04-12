import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";
import { getFrameworkById } from "@/app/(admin)/frameworks/action";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    // fetchBackend returns parsed data directly
    const data = await getFrameworkById(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
