import { NextRequest, NextResponse } from "next/server";

import { requireApiAccess } from "@/lib/access";
import { collectGlobalSignals } from "@/lib/signal-collector";
import { fetchAllTrends } from "@/lib/trend-repository";

export async function GET(request: NextRequest) {
  const access = await requireApiAccess(request);
  if (!access.ok) {
    return access.response;
  }

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? undefined;
  const kategori = searchParams.get("kategori") ?? undefined;
  const sok = searchParams.get("sok") ?? undefined;
  const includeSignals = searchParams.get("includeSignals") === "1";
  const limitValue = searchParams.get("limit");
  const limit = limitValue ? Number(limitValue) : undefined;

  const data = await fetchAllTrends({ region, kategori, sok, limit });
  const source = process.env.DATABASE_URL ? "postgres-neon" : "mock";

  if (!includeSignals) {
    return NextResponse.json({ data, meta: { kilde: source } });
  }

  const signals = await collectGlobalSignals();

  return NextResponse.json({
    data,
    signals,
    meta: { kilde: source, global: true }
  });
}
