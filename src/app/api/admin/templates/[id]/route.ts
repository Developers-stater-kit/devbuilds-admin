import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    // Using /api/templates to match your Express backend route
    const data = await fetchBackend(`/api/templates/${id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const data = await fetchBackend(`/api/templates/${id}`, {
      method: "PUT",
      body: body, // fetchBackend handles stringifying
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await fetchBackend(`/api/templates/${id}`, {
      method: "DELETE",
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}