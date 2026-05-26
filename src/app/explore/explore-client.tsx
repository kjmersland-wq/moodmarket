"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { TrendCard } from "@/components/trend-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { categories, regions } from "@/lib/mock-data";
import { Trend } from "@/lib/types";

export function ExploreClient() {
  const [sok, setSok] = useState("");
  const [region, setRegion] = useState("Hele verden");
  const [kategori, setKategori] = useState("Alle");
  const [filtered, setFiltered] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTrends() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (region) query.set("region", region);
        if (kategori) query.set("kategori", kategori);
        if (sok) query.set("sok", sok);

        const response = await fetch(`/api/trends?${query.toString()}`, { cache: "no-store" });
        const payload = (await response.json()) as { data?: Trend[] };
        if (!active) return;
        setFiltered(payload.data ?? []);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTrends();

    return () => {
      active = false;
    };
  }, [region, kategori, sok]);

  return (
    <AppShell>
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-semibold text-white">Utforsk</h2>
        <p className="text-slate-300">Søk etter globale trender</p>
      </div>

      <section className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:grid-cols-3">
        <Input placeholder="Søk etter globale trender" value={sok} onChange={(e) => setSok(e.target.value)} />
        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          options={regions.map((item) => ({ label: item, value: item }))}
        />
        <Select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          options={["Alle", ...categories].map((item) => ({ label: item, value: item }))}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && filtered.length === 0 ? (
          <p className="text-slate-300">Laster trender...</p>
        ) : null}
        {filtered.map((trend, index) => (
          <TrendCard key={trend.id} trend={trend} index={index} />
        ))}
      </section>
    </AppShell>
  );
}