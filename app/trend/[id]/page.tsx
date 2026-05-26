import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChartLine, Globe, Link2, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/moodmarket/app-shell";
import { MiniSparkline } from "@/components/moodmarket/mini-sparkline";
import { StrengthIndicator } from "@/components/moodmarket/strength-indicator";
import { CopyPromptButton } from "@/components/moodmarket/copy-prompt-button";
import { Badge } from "@/components/ui/badge";
import { getTrendById } from "@/lib/trend-service";
import { formatPercent } from "@/lib/utils";
import { getProfitabilityData, getCompetitors } from "@/lib/prompt-generator";

type TrendDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrendDetailPage({ params }: TrendDetailPageProps) {
  const { id } = await params;
  const trend = getTrendById(id);

  if (!trend) {
    notFound();
  }

  const profitability = getProfitabilityData(trend.category);
  const competitors = getCompetitors(trend.category);

  return (
    <AppShell currentPath="/">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" />
            Tilbake til dashboard
          </Link>
          <CopyPromptButton trend={trend} />
        </div>

        <div className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-[1.3fr_1fr] md:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{trend.category}</Badge>
              <Badge className="text-cyan-100">{trend.country}</Badge>
              <Badge className="text-zinc-200">{trend.region}</Badge>
            </div>
            <h2 className="text-3xl font-semibold text-zinc-50 md:text-4xl">{trend.name}</h2>
            <p className="text-sm text-zinc-300 md:text-base">{trend.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Siste 24 timer" value={formatPercent(trend.growth24h)} />
              <Metric label="Siste 7 dager" value={formatPercent(trend.growth7d)} />
              <Metric label="Siste 30 dager" value={formatPercent(trend.growth30d)} />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Trendscore</p>
            <p className="text-5xl font-semibold text-cyan-200">{trend.trendScore}</p>
            <MiniSparkline points={trend.sparkline} className="h-14 w-full" />
            <StrengthIndicator value={trend.strength} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
              <ChartLine className="h-5 w-5 text-cyan-200" />
              Hvorfor vokser denne?
            </h3>
            <p className="leading-relaxed text-zinc-300">{trend.aiSummary}</p>
          </article>

          <article className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
              <Globe className="h-5 w-5 text-cyan-200" />
              Hva betyr dette i markedet?
            </h3>
            <p className="leading-relaxed text-zinc-300">{trend.opportunity}</p>
            <div className="flex flex-wrap gap-2">
              {trend.useCases.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
              <Link2 className="h-5 w-5 text-cyan-200" />
              Kilder
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              {trend.sources.map((source) => (
                <li key={source.title} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="font-medium text-zinc-100">{source.title}</p>
                  <p className="mt-1 text-xs text-zinc-400">{source.sourceType}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-100">
            <Globe className="h-5 w-5 text-cyan-200" />
            Region
          </h3>
          <p className="text-zinc-300">
            Aktiv region: <span className="text-zinc-50">{trend.region}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Denne trenden overvakes som relevant for bade private brukere og virksomheter som vil oppdage ettersporsel, nye vaner og tidlige markedslommer.
          </p>
        </article>

        <article className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
            <TrendingUp className="h-5 w-5 text-cyan-200" />
            Lønnsomhetsanalyse
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {profitability.map((p) => (
              <div key={p.region} className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">{p.region}</p>
                <div className="space-y-1.5 text-sm">
                  <ProfitRow label="TAM" value={p.tam} />
                  <ProfitRow label="SAM" value={p.sam} />
                  <ProfitRow label="ARPA" value={p.arpa} />
                  <ProfitRow label="Gross margin" value={p.grossMargin} />
                  <ProfitRow label="LTV/CAC" value={p.ltvCac} />
                  <ProfitRow label="Payback" value={`${p.paybackMonths} mnd`} />
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">{p.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
            <Users className="h-5 w-5 text-cyan-200" />
            Konkurrenter
          </h3>
          <div className="space-y-3">
            {competitors.map((c) => (
              <div key={c.name} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-start sm:gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div>
                    <p className="font-medium text-zinc-100">{c.name}</p>
                    <p className="text-xs text-zinc-500">{c.startingPrice}</p>
                  </div>
                  <CompetitorTypeBadge type={c.type} />
                </div>
                <div className="grid gap-1 text-xs sm:grid-cols-2 sm:text-right">
                  <div>
                    <span className="text-emerald-400">+ </span>
                    <span className="text-zinc-300">{c.strengths}</span>
                  </div>
                  <div>
                    <span className="text-rose-400">− </span>
                    <span className="text-zinc-400">{c.weaknesses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-emerald-300">{value}</p>
    </div>
  );
}

function ProfitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-medium text-zinc-200">{value}</span>
    </div>
  );
}

function CompetitorTypeBadge({ type }: { type: "Direkte" | "Indirekte" | "Enterprise" }) {
  const colours: Record<string, string> = {
    Direkte: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    Indirekte: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Enterprise: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  };
  return (
    <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-xs font-medium ${colours[type]}`}>{type}</span>
  );
}
