"use client";

import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { Globe2, MapPinned, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trend } from "@/lib/types";

type WorldGeometry = {
  id: string;
  name: string;
  path: string;
};

type CountryBucket = {
  country: string;
  trends: Trend[];
  maxGrowth: number;
};

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryNameAliases: Record<string, string> = {
  usa: "United States of America",
  sverige: "Sweden",
  brasil: "Brazil"
};

function normalizeCountry(country: string) {
  return country.trim().toLowerCase();
}

function toMapCountryName(country: string) {
  const key = normalizeCountry(country);
  return countryNameAliases[key] ?? country;
}

export function WorldMapPanel() {
  const [world, setWorld] = useState<WorldGeometry[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [mapResponse, trendResponse] = await Promise.all([
        fetch(GEO_URL),
        fetch("/api/trends?limit=500", { cache: "no-store" })
      ]);

      const mapJson = (await mapResponse.json()) as {
        objects: { countries: unknown };
      };

      const trendJson = (await trendResponse.json()) as { data?: Trend[] };
      const collection = feature(mapJson as never, mapJson.objects.countries as never) as unknown as {
        features: Array<{ id?: string | number; properties?: Record<string, unknown>; geometry: unknown }>;
      };

      const projection = geoMercator().fitExtent(
        [
          [8, 8],
          [772, 372]
        ],
        collection as never
      );
      const pathGenerator = geoPath(projection);

      const shapes = collection.features
        .map((item) => {
          const path = pathGenerator(item as never);
          const name = String(item.properties?.name ?? "Unknown");
          if (!path) return null;
          return {
            id: String(item.id ?? name),
            name,
            path
          };
        })
        .filter((item): item is WorldGeometry => Boolean(item));

      if (!mounted) return;
      setWorld(shapes);
      setTrends(trendJson.data ?? []);
    }

    load().catch(() => {
      if (!mounted) return;
      setWorld([]);
      setTrends([]);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const countryBuckets = useMemo(() => {
    const buckets = new Map<string, CountryBucket>();

    for (const trend of trends) {
      if (trend.land === "Global") continue;
      const mapName = toMapCountryName(trend.land);
      const key = normalizeCountry(mapName);
      const current = buckets.get(key);
      if (!current) {
        buckets.set(key, {
          country: mapName,
          trends: [trend],
          maxGrowth: trend.vekstProsent
        });
      } else {
        current.trends.push(trend);
        current.maxGrowth = Math.max(current.maxGrowth, trend.vekstProsent);
      }
    }

    return buckets;
  }, [trends]);

  const visibleCountries = useMemo(() => {
    return Array.from(countryBuckets.values()).sort((a, b) => b.maxGrowth - a.maxGrowth);
  }, [countryBuckets]);

  useEffect(() => {
    if (!selectedCountry && visibleCountries.length > 0) {
      setSelectedCountry(visibleCountries[0].country);
    }
  }, [selectedCountry, visibleCountries]);

  const selected = selectedCountry ? countryBuckets.get(normalizeCountry(selectedCountry)) ?? null : null;

  function getFillColor(name: string) {
    const bucket = countryBuckets.get(normalizeCountry(name));
    if (!bucket) return "rgba(148, 163, 184, 0.13)";

    if (bucket.maxGrowth >= 40) return "rgba(34, 211, 238, 0.85)";
    if (bucket.maxGrowth >= 30) return "rgba(45, 212, 191, 0.75)";
    if (bucket.maxGrowth >= 20) return "rgba(74, 222, 128, 0.65)";
    return "rgba(125, 211, 252, 0.55)";
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-cyan-200" />
          Interaktivt verdenskart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {visibleCountries.map((bucket) => (
            <button
              key={bucket.country}
              type="button"
              onClick={() => setSelectedCountry(bucket.country)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                selectedCountry === bucket.country
                  ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              {bucket.country}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-2">
            <svg viewBox="0 0 780 380" className="h-[340px] w-full">
              <rect x="0" y="0" width="780" height="380" rx="18" fill="rgba(2,6,23,0.4)" />
              {world.map((geo) => {
                const isSelected = selectedCountry && normalizeCountry(selectedCountry) === normalizeCountry(geo.name);
                return (
                  <path
                    key={geo.id}
                    d={geo.path}
                    fill={isSelected ? "rgba(34, 211, 238, 0.95)" : getFillColor(geo.name)}
                    stroke="rgba(15, 23, 42, 0.65)"
                    strokeWidth={0.65}
                    onClick={() => {
                      if (countryBuckets.has(normalizeCountry(geo.name))) {
                        setSelectedCountry(geo.name);
                      }
                    }}
                    className={countryBuckets.has(normalizeCountry(geo.name)) ? "cursor-pointer" : ""}
                  />
                );
              })}
            </svg>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/85">Valgte markeder</p>
            {selected ? (
              <>
                <h3 className="text-3xl font-semibold text-white">{selected.country}</h3>
                <p className="text-sm text-slate-300">
                  {selected.trends.length} trend{selected.trends.length === 1 ? "" : "er"} funnet
                </p>
                <div className="space-y-2">
                  {selected.trends.slice(0, 4).map((trend) => (
                    <div key={trend.id} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                      <p className="text-sm font-medium text-white">{trend.navn}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-200">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +{trend.vekstProsent.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-slate-300">
                <p className="inline-flex items-center gap-2 text-sm">
                  <Globe2 className="h-4 w-4 text-cyan-200" />
                  Klikk et markert land i kartet for å se trenddetaljer.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
