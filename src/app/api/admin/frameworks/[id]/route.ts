import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    // fetchBackend returns parsed data directly
    const data = await fetchBackend(`/api/admin/frameworks/${id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    // fetchBackend handles JSON.stringify(body)
    const data = await fetchBackend(`/api/admin/frameworks/${id}`, {
      method: "PUT",
      body: body,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await fetchBackend(`/api/admin/frameworks/${id}`, {
      method: "DELETE",
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}