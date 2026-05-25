"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/moodmarket/app-shell";
import { ExploreFilters } from "@/components/moodmarket/explore-filters";
import { TrendCard } from "@/components/moodmarket/trend-card";
import { categories, regions, searchTrends } from "@/lib/trend-service";
import { RegionFilter, TrendCategory } from "@/lib/types";

export default function UtforskPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("Hele verden");
  const [category, setCategory] = useState<TrendCategory | "Alle">("Alle");

  const results = useMemo(() => searchTrends(query, region, category), [query, region, category]);

  return (
    <AppShell currentPath="/utforsk">
      <section className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Utforsk</p>
          <h2 className="text-3xl font-semibold text-zinc-50 md:text-4xl">Sok etter globale trender</h2>
          <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
            Filtrer raskt pa region og kategori for a finne signaler innen okonomi, ferie, hobby, teknologi og andre globale markeder.
          </p>
        </header>

        <ExploreFilters
          query={query}
          region={region}
          category={category}
          regions={[...regions]}
          categories={["Alle", ...categories]}
          onQueryChange={setQuery}
          onRegionChange={(value) => setRegion(value as RegionFilter)}
          onCategoryChange={(value) => setCategory(value as TrendCategory | "Alle")}
        />

        <div className="flex items-center justify-between text-sm text-zinc-400">
          <p>{results.length} treff</p>
          <p>Sortert etter relevans og vekstsignal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((trend, index) => (
            <TrendCard key={trend.id} trend={trend} index={index} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
