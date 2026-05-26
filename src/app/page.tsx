import { ArrowRight, Globe, Signal, Star, Zap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SectionBlock } from "@/components/section-block";
import { TrendCard } from "@/components/trend-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageAccess } from "@/lib/access";
import { fetchAllTrends } from "@/lib/trend-repository";

const dashboardRegions = ["Nord-Amerika", "Europa", "Asia", "Sør-Amerika", "Afrika", "Oseania"] as const;

export default async function DashboardPage() {
  await requirePageAccess();

  const allTrends = await fetchAllTrends();
  const trendraketter = [...allTrends].sort((a, b) => b.vekstProsent - a.vekstProsent).slice(0, 4);
  const tidligeSignaler = [...allTrends]
    .sort((a, b) => b.vekst.h24 * 0.6 + b.vekst.d7 * 0.4 - (a.vekst.h24 * 0.6 + a.vekst.d7 * 0.4))
    .slice(0, 4);
  const mestOvervaket = [...allTrends].sort((a, b) => b.overvaketAv - a.overvaketAv).slice(0, 4);
  const nyeSignaler = [...allTrends].sort((a, b) => b.vekst.h24 - a.vekst.h24).slice(0, 4);
  const globalOverview = dashboardRegions.map((region) => {
    const rows = allTrends.filter((trend) => trend.region === region || trend.region === "Hele verden");
    const score = rows.length > 0 ? Math.round(rows.reduce((sum, trend) => sum + trend.trendScore, 0) / rows.length) : 0;
    return {
      region,
      score,
      signaler: rows.length
    };
  });

  return (
    <AppShell>
      <section className="mb-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:grid-cols-3 lg:items-end">
        <div className="lg:col-span-2">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-200/80">Global trendintelligens</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Oppdag hva som vokser globalt, før resten av markedet reagerer.
          </h2>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4 text-sm text-cyan-100">
          <p className="mb-2">Sanntidsdekning</p>
          <p className="text-2xl font-semibold">148 land</p>
        </div>
      </section>

      <div className="space-y-12">
        <SectionBlock title="Trendraketter" subtitle="Global vekst høyest" icon="🔥">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trendraketter.map((trend, i) => (
              <TrendCard key={trend.id} trend={trend} index={i} />
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Tidlige signaler" subtitle="Høy vekst + lav konkurranse" icon="📈">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tidligeSignaler.map((trend, i) => (
              <TrendCard key={trend.id} trend={trend} index={i} />
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Verdensoversikt" subtitle="Signalstyrke per region" icon="🌍">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {globalOverview.map((region) => (
              <Card key={region.region}>
                <CardHeader>
                  <CardTitle className="inline-flex items-center gap-2 text-xl">
                    <Globe className="h-5 w-5 text-cyan-200" />
                    {region.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Signalstyrke</span>
                    <span className="font-medium text-white">{region.score}/100</span>
                  </div>
                  <div className="mb-4 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${region.score}%` }} />
                  </div>
                  <p className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <Signal className="h-4 w-4 text-cyan-200" />
                    {region.signaler} aktive signaler
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionBlock>

        <div className="grid gap-12 xl:grid-cols-2">
          <SectionBlock title="Mest overvåket" subtitle="Trendene flest følger nå" icon="⭐">
            <div className="grid gap-4 md:grid-cols-2">
              {mestOvervaket.map((trend, i) => (
                <TrendCard key={trend.id} trend={trend} index={i} />
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title="Nye signaler" subtitle="Siste impulser oppdaget" icon="⚡">
            <div className="grid gap-4 md:grid-cols-2">
              {nyeSignaler.map((trend, i) => (
                <TrendCard key={trend.id} trend={trend} index={i} />
              ))}
            </div>
          </SectionBlock>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-200">Se globale trender filtrert etter region, kategori og vekst.</p>
            <a href="/explore" className="inline-flex items-center gap-2 text-cyan-100 transition hover:text-white">
              Gå til Utforsk
              <ArrowRight className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
