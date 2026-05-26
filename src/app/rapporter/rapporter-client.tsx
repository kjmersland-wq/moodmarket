"use client";

import { useMemo, useState } from "react";
import { Copy, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trend } from "@/lib/types";
import { buildPrompt, buildProjectIdeas } from "@/lib/idea-generator";

type Props = {
  trends: Trend[];
};

export function RapporterClient({ trends }: Props) {
  const [copied, setCopied] = useState(false);

  const ideas = useMemo(() => buildProjectIdeas(trends), [trends]);
  const prompt = useMemo(() => buildPrompt(trends, ideas), [trends, ideas]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Rapporter</p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Forslag og ferdig prompt basert på trendene</h2>
        <p className="max-w-3xl text-sm text-slate-300 md:text-base">
          Her får du forslag til prosjekter som passer signalene i appen, med lønnsomhet per marked, investorpotensial, konkurrenter og en ferdig prompt du kan lime inn i ChatGPT, Claude eller annen AI.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea, index) => {
          const trend = trends[index];
          return (
            <Card key={idea.title}>
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  {idea.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">Format: {idea.format}</p>
                <p className="text-sm text-slate-300">Målgruppe: {idea.audience}</p>
                <p className="text-sm text-slate-300">Hvorfor nå: {idea.whyNow}</p>
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">MVP</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {idea.mvp.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="pt-2 text-sm text-cyan-100">Monetisering: {idea.monetization}</p>
                {trend ? <p className="pt-1 text-xs text-slate-500">Basert på: {trend.navn}</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Klar prompt</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Kopier og bruk direkte</h3>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Kopiert" : "Kopier prompt"}
          </button>
        </div>

        <textarea
          readOnly
          value={prompt}
          className="mt-4 min-h-[420px] w-full rounded-3xl border border-white/10 bg-[#06101f] p-4 text-sm leading-relaxed text-slate-100 outline-none"
        />
      </section>
    </div>
  );
}