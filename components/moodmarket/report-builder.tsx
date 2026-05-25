"use client";

import { useMemo, useState } from "react";
import { FileDown, Sparkles } from "lucide-react";
import { trends } from "@/lib/mock-data";
import {
  buildTrendReport,
  calculateIdeaFinancials,
  formatNok,
  formatRevenueRange,
  generateTrendReportPdf,
} from "@/lib/report-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const defaultSelected = trends.slice(0, 3).map((trend) => trend.id);

export function ReportBuilder() {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);

  const selectedTrends = useMemo(
    () => trends.filter((trend) => selectedIds.includes(trend.id)),
    [selectedIds]
  );

  const report = useMemo(() => buildTrendReport(selectedTrends), [selectedTrends]);

  function toggleTrend(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        if (current.length === 1) return current;
        return current.filter((value) => value !== id);
      }
      return [...current, id];
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Rapportgrunnlag</p>
              <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Velg trendspor</h3>
            </div>
            <Badge>{selectedTrends.length} valgt</Badge>
          </div>

          <div className="mt-5 grid gap-3">
            {trends.map((trend) => {
              const active = selectedIds.includes(trend.id);
              return (
                <button
                  key={trend.id}
                  type="button"
                  onClick={() => toggleTrend(trend.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-cyan-300/40 bg-cyan-400/10"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-50">{trend.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">{trend.category} · {trend.country}</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-300">+{trend.growthPercent.toFixed(1)}%</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{trend.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Eksport</p>
              <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Profesjonell trendrapport</h3>
            </div>
            <Button onClick={() => generateTrendReportPdf(report)}>
              <FileDown className="mr-2 h-4 w-4" />
              Last ned PDF
            </Button>
          </div>

          <div className="mt-5 space-y-5">
            {report.map((entry) => (
              <article key={entry.trend.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-semibold text-zinc-50">{entry.trend.name}</h4>
                    <p className="text-sm text-zinc-400">{entry.trend.category} · {entry.trend.country}</p>
                  </div>
                  <Badge className="text-cyan-100">Score {entry.trend.trendScore}</Badge>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{entry.trend.opportunity}</p>

                <div className="mt-4 grid gap-3">
                  {entry.ideas.map((idea) => (
                    <div key={idea.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-cyan-200" />
                          <p className="font-medium text-zinc-50">{idea.title}</p>
                        </div>
                        <Badge>{idea.format}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">{idea.description}</p>
                      {(() => {
                        const financials = calculateIdeaFinancials(idea);
                        return (
                          <>
                      <div className="mt-3 grid gap-2 text-sm text-zinc-400 md:grid-cols-2">
                        <p>Maalgruppe: <span className="text-zinc-200">{idea.targetAudience}</span></p>
                        <p>Prismodell: <span className="text-zinc-200">{idea.pricingModel}</span></p>
                        <p>Estimert inntjening: <span className="text-emerald-300">{formatRevenueRange(idea.revenueLowNok, idea.revenueHighNok)}</span></p>
                        <p>Sikkerhet: <span className="text-zinc-200">{idea.confidence}</span></p>
                      </div>

                      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">12-maneders prognose</p>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full min-w-[520px] text-left text-xs text-zinc-300">
                            <thead className="text-zinc-400">
                              <tr>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <th key={i} className="pr-3 pb-2 font-medium">M{i + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {financials.monthly.map((month) => (
                                  <td key={`base-${month.month}`} className="pr-3 pb-1 text-emerald-300">
                                    {Math.round(month.baseNok / 1000)}k
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                {financials.monthly.map((month) => (
                                  <td key={`best-${month.month}`} className="pr-3 pb-1 text-cyan-200">
                                    {Math.round(month.bestNok / 1000)}k
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                {financials.monthly.map((month) => (
                                  <td key={`worst-${month.month}`} className="pr-3 text-rose-300">
                                    {Math.round(month.worstNok / 1000)}k
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2 text-xs text-zinc-500">Rad 1: base, rad 2: best, rad 3: worst.</p>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-zinc-400 md:grid-cols-2">
                        <p>12m base inntjening: <span className="text-emerald-300">{formatNok(financials.sumBaseNok)}</span></p>
                        <p>12m best inntjening: <span className="text-cyan-200">{formatNok(financials.sumBestNok)}</span></p>
                        <p>12m worst inntjening: <span className="text-rose-300">{formatNok(financials.sumWorstNok)}</span></p>
                        <p>12m kostnader: <span className="text-zinc-200">{formatNok(financials.totalCost12mNok)}</span></p>
                        <p>Break-even: <span className="text-zinc-200">{financials.breakEvenMonth ? `Mnd ${financials.breakEvenMonth}` : "Etter 12 maneder"}</span></p>
                        <p>ROI (base, 12m): <span className="text-zinc-200">{financials.roi12mBasePercent}%</span></p>
                      </div>
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Vurdering</p>
        <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Hvordan estimatene er regnet</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">
          Inntektsintervallene er scenario-baserte og bygger pa trendscore, styrke, vekst siste 24 timer, vekst siste 7 dager og sannsynlig betalingsvilje i kategorien. Tallene er ment som realistiske arbeidsestimater for tidlig fase, ikke garantier.
        </p>
      </section>
    </div>
  );
}
