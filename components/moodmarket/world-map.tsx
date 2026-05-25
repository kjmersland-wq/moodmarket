"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { countryHeat } from "@/lib/mock-data";

export function WorldMap() {
  const [activeCode, setActiveCode] = useState(countryHeat[0]?.code ?? "");

  const active = useMemo(
    () => countryHeat.find((country) => country.code === activeCode) ?? countryHeat[0],
    [activeCode]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-indigo-950/30 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(14,116,144,0.18),transparent_45%)]" />
        <div className="relative h-full w-full rounded-xl border border-white/10 bg-black/20">
          {countryHeat.map((country) => (
            <button
              key={country.code}
              onClick={() => setActiveCode(country.code)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${country.x}%`, top: `${country.y}%` }}
              aria-label={`Vis trender for ${country.country}`}
            >
              <span
                className="block rounded-full border border-cyan-200/30 bg-cyan-300/20"
                style={{ width: `${8 + country.heat / 6}px`, height: `${8 + country.heat / 6}px` }}
              />
              <span className="pointer-events-none absolute left-1/2 top-[130%] hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-zinc-900/90 px-2 py-1 text-[10px] text-zinc-200 group-hover:block">
                {country.country}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.aside
        key={active?.code}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Valgt land</p>
        <h3 className="text-2xl font-semibold text-zinc-50">{active.country}</h3>
        <p className="text-sm text-cyan-200">{active.label} ↑</p>
        <div>
          <p className="text-sm text-zinc-300">Voksende trender</p>
          <ul className="mt-2 space-y-2 text-sm text-zinc-100">
            {active.featuredTrends.map((trend) => (
              <li key={trend} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                {trend}
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </div>
  );
}
