import { notFound } from "next/navigation";
import { BarChart3, CalendarClock, Globe2, Layers3 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageAccess } from "@/lib/access";
import { fetchTrendById } from "@/lib/trend-repository";
import { toPercent } from "@/lib/utils";

export default async function TrendDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  await requirePageAccess();

  const { slug } = await params;
  const trend = await fetchTrendById(slug);

  if (!trend) {
    notFound();
  }

  return (
    <AppShell>
      <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Badge>{trend.kategori}</Badge>
          <Badge className="border-emerald-300/30 bg-emerald-300/10 text-emerald-200">{trend.land}</Badge>
        </div>
        <h2 className="mb-1 text-4xl font-semibold tracking-tight text-white">{trend.navn}</h2>
        <p className="text-slate-300">Trendscore: {trend.trendScore} / 100</p>
      </section>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-cyan-200" />
              Siste 24 timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{toPercent(trend.vekst.h24)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-cyan-200" />
              Siste 7 dager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{toPercent(trend.vekst.d7)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <Layers3 className="h-4 w-4 text-cyan-200" />
              Siste 30 dager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{toPercent(trend.vekst.d30)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI-oppsummering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-200">Hvorfor vokser denne?</p>
            <p className="mt-2 text-slate-300">{trend.oppsummering}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-cyan-200" />
              Kilder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              {trend.kilder.map((source) => (
                <li key={source.name} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="font-medium text-white">{source.name}</p>
                  <p className="text-sm text-slate-400">{source.url}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
