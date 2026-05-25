"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { countryHeat, trends } from "@/lib/mock-data";
import { RegionFilter } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const regionOptions: RegionFilter[] = [
  "Hele verden",
  "Europa",
  "Nord-Amerika",
  "Sor-Amerika",
  "Asia",
  "Afrika",
  "Oseania",
];

const continentPaths = [
  "M83 126 L155 84 L223 96 L249 145 L213 184 L164 173 L122 197 L91 176 Z",
  "M240 236 L285 250 L298 299 L278 371 L247 413 L216 370 L224 296 Z",
  "M429 96 L500 83 L555 107 L585 143 L553 171 L490 164 L444 143 Z",
  "M483 178 L550 173 L595 200 L587 245 L540 264 L502 235 L470 205 Z",
  "M510 274 L555 283 L589 342 L565 409 L523 434 L486 388 L473 332 Z",
  "M657 124 L748 114 L840 149 L865 204 L832 253 L745 247 L679 220 L639 172 Z",
  "M734 286 L804 303 L845 349 L835 396 L784 413 L726 388 L701 336 Z",
];

export function WorldMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("Hele verden");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([countryHeat[0]?.code ?? ""]);

  const visibleCountries = useMemo(
    () =>
      selectedRegion === "Hele verden"
        ? countryHeat
        : countryHeat.filter((country) => country.region === selectedRegion),
    [selectedRegion]
  );

  const effectiveSelectedCodes = useMemo(() => {
    const visibleCodes = new Set(visibleCountries.map((country) => country.code));
    const kept = selectedCodes.filter((code) => visibleCodes.has(code));

    if (kept.length > 0) return kept;
    return visibleCountries[0] ? [visibleCountries[0].code] : [];
  }, [selectedCodes, visibleCountries]);

  const selectedCountries = useMemo(
    () => visibleCountries.filter((country) => effectiveSelectedCodes.includes(country.code)),
    [effectiveSelectedCodes, visibleCountries]
  );

  const aggregatedTrends = useMemo(() => {
    const byName = new Map(trends.map((trend) => [trend.name, trend]));
    return selectedCountries
      .flatMap((country) => country.featuredTrends.map((trendName) => byName.get(trendName)))
      .filter((trend): trend is (typeof trends)[number] => Boolean(trend))
      .sort((left, right) => right.trendScore - left.trendScore);
  }, [selectedCountries]);

  function toggleCountry(code: string) {
    setSelectedCodes((current) => {
      if (current.includes(code)) {
        if (current.length === 1) return current;
        return current.filter((value) => value !== code);
      }

      return [...current, code];
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <div className="space-y-4">
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

        <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-indigo-950/30 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(14,116,144,0.18),transparent_45%)]" />
        <div className="relative h-full w-full rounded-xl border border-white/10 bg-black/20">
          <svg viewBox="0 0 1000 500" className="absolute inset-0 h-full w-full opacity-95" aria-hidden>
            <defs>
              <linearGradient id="map-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(34,211,238,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </linearGradient>
            </defs>
            {continentPaths.map((path) => (
              <path
                key={path}
                d={path}
                fill="url(#map-fill)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          <div className="absolute left-6 top-4 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Velg ett eller flere land
          </div>

          {visibleCountries.map((country) => {
            const active = effectiveSelectedCodes.includes(country.code);
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => toggleCountry(country.code)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
                aria-label={`Velg ${country.country}`}
              >
                <span
                  className={`block rounded-full border transition-all ${
                    active
                      ? "border-cyan-100/80 bg-cyan-300/70 shadow-[0_0_0_10px_rgba(34,211,238,0.18)]"
                      : "border-cyan-200/30 bg-cyan-300/20"
                  }`}
                  style={{ width: `${8 + country.heat / 6}px`, height: `${8 + country.heat / 6}px` }}
                />
                <span className="pointer-events-none absolute left-1/2 top-[135%] hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-zinc-900/90 px-2 py-1 text-[10px] text-zinc-200 group-hover:block">
                  {country.country}
                </span>
              </button>
            );
          })}
        </div>

          <div className="mt-4 flex flex-wrap gap-2">
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
      </div>

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
          {selectedCountries.map((country) => (
            <Badge key={country.code}>{country.country}</Badge>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">
          {selectedCountries.length === 1
            ? selectedCountries[0]?.description
            : "Sammenlign flere markeder samtidig for a se hvilke signaler som vokser pa tvers av land og kontinenter."}
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
