import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

type RouteContext = {
  params: Promise<{ frameworkKey: string; featureKey: string }>;
};

// LINK: Framework to Feature
export async function POST(request: Request, context: RouteContext) {
  try {
    const { frameworkKey, featureKey } = await context.params;
    const data = await fetchBackend(`/api/admin/link/frameworks/${frameworkKey}/features/${featureKey}`, {
      method: "POST",
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UNLINK: Framework from Feature
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { frameworkKey, featureKey } = await context.params;
    const data = await fetchBackend(`/api/admin/link/frameworks/${frameworkKey}/features/${featureKey}`, {
      method: "DELETE",
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}