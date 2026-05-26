"use client";

import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { motion } from "framer-motion";
import { feature } from "topojson-client";
import { countryHeat, trends } from "@/lib/mock-data";
import { RegionFilter } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const GEO_URL = "/world-110m.json";
const MAP_WIDTH = 860;
const MAP_HEIGHT = 420;
const MAP_PADDING = 18;

const regionOptions: RegionFilter[] = [
  "Hele verden",
  "Europa",
  "Nord-Amerika",
  "Sor-Amerika",
  "Asia",
  "Afrika",
  "Oseania",
];

type MapFeature = {
  id?: string | number;
  properties: Record<string, unknown>;
};

type WorldTopology = {
  objects: {
    countries: object;
  };
};

function normalizeNumericCode(value: string | number) {
  const normalized = Number(value);
  return Number.isNaN(normalized) ? String(value) : String(normalized);
}

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
  const [geographies, setGeographies] = useState<MapFeature[]>([]);

  useEffect(() => {
    let active = true;

    async function loadGeographies() {
      const response = await fetch(GEO_URL);
      const topology = (await response.json()) as WorldTopology;
      const collection = feature(topology as never, topology.objects.countries as never);

      if (!active || !("features" in collection)) {
        return;
      }

      setGeographies(collection.features as MapFeature[]);
    }

    loadGeographies().catch(() => {
      if (active) {
        setGeographies([]);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const numericToCountry = useMemo(() => {
    const map = new Map<string, (typeof countryHeat)[number]>();
    for (const c of countryHeat) {
      const num = alpha2ToNumeric[c.code];
      if (num) map.set(normalizeNumericCode(num), c);
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

  const visibleNumericCodes = useMemo(
    () =>
      new Set(
        visibleCountries
          .map((country) => alpha2ToNumeric[country.code])
          .filter((value): value is string => Boolean(value))
          .map((value) => normalizeNumericCode(value))
      ),
    [visibleCountries]
  );

  const projection = useMemo(() => {
    const baseProjection = geoNaturalEarth1();
    const regionGeographies =
      selectedRegion === "Hele verden"
        ? geographies
        : geographies.filter((geo) => geo.id !== undefined && visibleNumericCodes.has(normalizeNumericCode(geo.id)));

    const targetGeographies = regionGeographies.length > 0 ? regionGeographies : geographies;

    if (targetGeographies.length === 0) {
      return baseProjection;
    }

    return baseProjection.fitExtent(
      [
        [MAP_PADDING, MAP_PADDING],
        [MAP_WIDTH - MAP_PADDING, MAP_HEIGHT - MAP_PADDING],
      ],
      {
        type: "FeatureCollection",
        features: targetGeographies,
      } as never
    );
  }, [geographies, selectedRegion, visibleNumericCodes]);

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

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

          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="h-[380px] w-full"
            role="img"
            aria-label="Verdenskart med markeder"
          >
            {geographies.map((geo, index) => {
              if (geo.id === undefined) {
                return null;
              }

              const countryData = numericToCountry.get(normalizeNumericCode(geo.id));
              const isVisible = countryData !== undefined && visibleNumericCodes.has(normalizeNumericCode(geo.id));
              const isActive = countryData !== undefined && isVisible && effectiveSelectedCodes.includes(countryData.code);
              const heat = isVisible ? (countryData?.heat ?? 0) : 0;
              const fill = heat > 0 ? heatToColor(heat, isActive) : "rgba(255,255,255,0.04)";
              const stroke = heat > 0 ? heatToStroke(isActive) : "rgba(255,255,255,0.08)";
              const path = pathGenerator(geo as never);

              if (!path) {
                return null;
              }

              return (
                <path
                  key={`${String(geo.id)}-${index}`}
                  d={path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                  className={heat > 0 ? "cursor-pointer transition-colors" : "transition-colors"}
                  onMouseEnter={() => {
                    if (countryData && isVisible) {
                      setTooltip({ name: countryData.country, heat: countryData.heat });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => {
                    if (countryData && isVisible) {
                      toggleCountry(countryData.code);
                    }
                  }}
                />
              );
            })}
          </svg>

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
