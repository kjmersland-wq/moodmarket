"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe } from "lucide-react";
import { Trend } from "@/lib/types";
import { formatPercent } from "@/lib/utils";
import { MiniSparkline } from "@/components/moodmarket/mini-sparkline";
import { StrengthIndicator } from "@/components/moodmarket/strength-indicator";
import { Badge } from "@/components/ui/badge";

type TrendCardProps = {
  trend: Trend;
  index?: number;
};

export function TrendCard({ trend, index = 0 }: TrendCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.06]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-zinc-100">{trend.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
            <Badge>{trend.category}</Badge>
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {trend.country}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Vekst</p>
          <p className="text-lg font-semibold text-emerald-300">{formatPercent(trend.growthPercent)}</p>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-400">Trendscore</p>
          <p className="text-2xl font-semibold text-zinc-50">{trend.trendScore}</p>
        </div>
        <MiniSparkline points={trend.sparkline} className="h-10 w-28" />
      </div>

      <StrengthIndicator value={trend.strength} />

      <Link
        href={`/trend/${trend.id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-200 transition-colors hover:text-cyan-100"
      >
        Se trenddetaljer
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}
