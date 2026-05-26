"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trend } from "@/lib/types";
import { toPercent } from "@/lib/utils";

function buildSparklinePath(values: number[]) {
  if (!values.length) {
    return "";
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const scaleY = (value: number) => {
    if (max === min) {
      return 22;
    }

    return 44 - ((value - min) / (max - min)) * 40;
  };

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = scaleY(value);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export function TrendCard({ trend, index = 0 }: { trend: Trend; index?: number }) {
  const sparklinePath = buildSparklinePath(trend.sparkline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Card className="group h-full transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10">
        <CardHeader>
          <div>
            <CardTitle className="mb-1 text-xl">{trend.navn}</CardTitle>
            <p className="text-sm text-slate-300">{trend.kategori}</p>
          </div>
          <Badge>{toPercent(trend.vekstProsent)}</Badge>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-cyan-200" />
              {trend.land}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-200" />
              Score {trend.trendScore}
            </span>
          </div>

          <div className="mb-3 h-20 overflow-hidden rounded-xl border border-white/10 bg-slate-950/30 p-2">
            <svg viewBox="0 0 100 44" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
              <path d="M0,44 L100,44" stroke="rgba(148,163,184,0.2)" strokeWidth="0.8" fill="none" />
              <path
                d={sparklinePath}
                stroke="#67e8f9"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-400">Styrkeindikator</p>
            <Progress value={trend.trendScore} />
          </div>

          <Link
            href={`/trender/${trend.id}`}
            className="inline-flex items-center gap-1 text-sm text-cyan-100 transition hover:text-white"
          >
            Se trenddetaljer
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
