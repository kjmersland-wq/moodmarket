import { NextRequest, NextResponse } from "next/server";

import { requireApiAccess } from "@/lib/access";
import { fetchTrendById } from "@/lib/trend-repository";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const access = await requireApiAccess(request);
  if (!access.ok) {
    return access.response;
  }

  const { slug } = await params;
  const trend = await fetchTrendById(slug);

  if (!trend) {
    return NextResponse.json({ error: "Fant ikke trend" }, { status: 404 });
  }

  return NextResponse.json({ data: trend });
}
