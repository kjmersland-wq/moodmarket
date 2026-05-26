"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { countryHeat, trends } from "@/lib/mock-data";
import { RegionFilter } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const GEO_URL = "/world-110m.json";

const regionOptions: RegionFilter[] = [
  "Hele verden",
  "Europa",
  "Nord-Amerika",
  "Sor-Amerika",
  "Asia",
  "Afrika",
  "Oseania",
];

/** ISO alpha-2 → numeric string used in world-atlas topojson */
const alpha2ToNumeric: Record<string, string> = {
  US: "840",
  CA: "124",
  BR: "076",
  GB: "826",
  SE: "752",
  DE: "276",
  NL: "528",
  ES: "724",
  IT: "380",
  PT: "620",
  IS: "352",
  KE: "404",
  JP: "392",
  ID: "360",
  AU: "036",
};

/** Region zoom/center presets */
const regionView: Record<RegionFilter, { center: [number, number]; zoom: number }> = {
  "Hele verden":   { center: [10, 10],   zoom: 1 },
  "Nord-Amerika":  { center: [-100, 40], zoom: 2.8 },
  "Sor-Amerika":   { center: [-60, -15], zoom: 2.8 },
  Europa:          { center: [15, 52],   zoom: 4.5 },
  Asia:            { center: [100, 30],  zoom: 2.6 },
  Afrika:          { center: [20, 5],    zoom: 2.8 },
  Oseania:         { center: [140, -25], zoom: 3.2 },
};

function heatToColor(heat: number, selected: boolean): string {
  if (selected) return "rgba(34,211,238,0.85)";
  if (heat >= 85) return "rgba(34,211,238,0.55)";
  if (heat >= 70) return "rgba(34,211,238,0.38)";
  if (heat >= 55) return "rgba(34,211,238,0.22)";
  return "rgba(34,211,238,0.10)";
}

function heatToStroke(selected: boolean): string {
  return selected ? "rgba(34,211,238,0.9)" : "rgba(255,255,255,0.12)";
}

export function WorldMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("Hele verden");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([countryHeat[0]?.code ?? ""]);
  const [tooltip, setTooltip] = useState<{ name: string; heat: number } | null>(null);

  const numericToCountry = useMemo(() => {
    const map = new Map<string, (typeof countryHeat)[number]>();
    for (const c of countryHeat) {
      const num = alpha2ToNumeric[c.code];
      if (num) map.set(num, c);
    }
    return map;
  }, []);

  const visibleCountries = useMemo(
    () =>
      selectedRegion === "Hele verden"
        ? countryHeat
        : countryHeat.filter((c) => c.region === selectedRegion),
    [selectedRegion]
  );

  const effectiveSelectedCodes = useMemo(() => {
    const visibleCodes = new Set(visibleCountries.map((c) => c.code));
    const kept = selectedCodes.filter((code) => visibleCodes.has(code));
    if (kept.length > 0) return kept;
    return visibleCountries[0] ? [visibleCountries[0].code] : [];
  }, [selectedCodes, visibleCountries]);

  const selectedCountries = useMemo(
    () => visibleCountries.filter((c) => effectiveSelectedCodes.includes(c.code)),
    [effectiveSelectedCodes, visibleCountries]
  );

  const aggregatedTrends = useMemo(() => {
    const byName = new Map(trends.map((t) => [t.name, t]));
    return selectedCountries
      .flatMap((c) => c.featuredTrends.map((name) => byName.get(name)))
      .filter((t): t is (typeof trends)[number] => Boolean(t))
      .sort((a, b) => b.trendScore - a.trendScore);
  }, [selectedCountries]);

  function toggleCountry(code: string) {
    setSelectedCodes((cur) => {
      if (cur.includes(code)) {
        if (cur.length === 1) return cur;
        return cur.filter((v) => v !== code);
      }
      return [...cur, code];
    });
  }

  const { center, zoom } = regionView[selectedRegion];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <div className="space-y-4">
        {/* Region tabs */}
        <div className="flex flex-wrap gap-2">
          {regionOptions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                selectedRegion === region
                  ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-zinc-100"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Map canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-indigo-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(14,116,144,0.12),transparent_45%)] pointer-events-none" />

          {/* Tooltip */}
          {tooltip && (
            <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/15 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-100 shadow-lg">
              {tooltip.name}
              {tooltip.heat > 0 && (
                <span className="ml-2 text-cyan-300">Heat {tooltip.heat}</span>
              )}
            </div>
          )}

          <ComposableMap
            projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
            className="h-[380px] w-full"
          >
            <ZoomableGroup
              center={center}
              zoom={zoom}
              maxZoom={8}
              minZoom={1}
            >
              <Geographies geography={GEO_URL}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo) => {
                    const countryData = numericToCountry.get(String(geo.id));
                    const isActive =
                      countryData !== undefined &&
                      effectiveSelectedCodes.includes(countryData.code) &&
                      visibleCountries.some((c) => c.code === countryData.code);
                    const heat = countryData?.heat ?? 0;
                    const fill = heat > 0 ? heatToColor(heat, isActive) : "rgba(255,255,255,0.04)";
                    const stroke = heat > 0 ? heatToStroke(isActive) : "rgba(255,255,255,0.08)";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none", cursor: heat > 0 ? "pointer" : "default" },
                          hover:   { outline: "none", fill: heat > 0 ? "rgba(34,211,238,0.55)" : "rgba(255,255,255,0.07)", cursor: heat > 0 ? "pointer" : "default" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => {
                          if (countryData) setTooltip({ name: countryData.country, heat: countryData.heat });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => {
                          if (countryData) toggleCountry(countryData.code);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Heat legend */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-[10px] text-zinc-400">
            <span>Lav</span>
            {[0.10, 0.22, 0.38, 0.55, 0.85].map((a) => (
              <span
                key={a}
                className="h-3 w-4 rounded-sm"
                style={{ background: `rgba(34,211,238,${a})` }}
              />
            ))}
            <span>Høy</span>
          </div>
        </div>

        {/* Country chip bar */}
        <div className="flex flex-wrap gap-2">
          {visibleCountries.map((country) => {
            const active = effectiveSelectedCodes.includes(country.code);
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => toggleCountry(country.code)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-zinc-100"
                }`}
              >
                {country.country}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside
        key={`${selectedRegion}-${effectiveSelectedCodes.join("-")}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Valgte markeder</p>
        <h3 className="text-2xl font-semibold text-zinc-50">
          {selectedCountries.length === 1
            ? selectedCountries[0]?.country
            : `${selectedCountries.length} land i ${selectedRegion}`}
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedCountries.map((c) => (
            <Badge key={c.code}>{c.country}</Badge>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">
          {selectedCountries.length === 1
            ? selectedCountries[0]?.description
            : "Sammenlign flere markeder samtidig for å se hvilke signaler som vokser på tvers av land og kontinenter."}
        </p>
        <div>
          <p className="text-sm text-zinc-300">Voksende trender</p>
          <ul className="mt-2 space-y-2 text-sm text-zinc-100">
            {aggregatedTrends.slice(0, 6).map((trend) => (
              <li key={trend.id} className="rounded-lg border border-white/10 bg-black/20 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-50">{trend.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">{trend.category} · {trend.country}</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-300">+{trend.growthPercent.toFixed(1)}%</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">{trend.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Dekning</p>
          <p className="mt-2 text-sm text-zinc-200">Regionfilter: {selectedRegion}</p>
          <p className="mt-1 text-sm text-zinc-400">
            {visibleCountries.length} markeder tilgjengelige, {selectedCountries.length} valgt.
          </p>
        </div>
      </motion.aside>
    </div>
  );
}


