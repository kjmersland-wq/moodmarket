import { categories, regions, trends } from "@/lib/mock-data";
import { RegionFilter, Trend, TrendCategory, TrendSectionKey } from "@/lib/types";

export const dashboardSections: { key: TrendSectionKey; title: string; subtitle: string }[] = [
  {
    key: "trendraketter",
    title: "Trendraketter",
    subtitle: "Global vekst hoyest akkurat na",
  },
  {
    key: "tidlige-signaler",
    title: "Tidlige signaler",
    subtitle: "Hoy vekst kombinert med lav konkurranse",
  },
  {
    key: "verdensoversikt",
    title: "Verdensoversikt",
    subtitle: "Topptrender pa tvers av regioner",
  },
  {
    key: "mest-overvaket",
    title: "Mest overvaket",
    subtitle: "Trendene flest team folger aktivt",
  },
  {
    key: "nye-signaler",
    title: "Nye signaler",
    subtitle: "Ferske trender oppdaget siste timer",
  },
];

export function getTrendsForSection(key: TrendSectionKey): Trend[] {
  const copy = [...trends];
  switch (key) {
    case "trendraketter":
      return copy.sort((a, b) => b.growthPercent - a.growthPercent).slice(0, 4);
    case "tidlige-signaler":
      return copy
        .filter((t) => t.strength >= 60 && t.watchedBy < 1300)
        .sort((a, b) => b.growth24h - a.growth24h)
        .slice(0, 4);
    case "verdensoversikt":
      return copy.sort((a, b) => b.trendScore - a.trendScore).slice(0, 6);
    case "mest-overvaket":
      return copy.sort((a, b) => b.watchedBy - a.watchedBy).slice(0, 4);
    case "nye-signaler":
      return copy.sort((a, b) => a.launchedHoursAgo - b.launchedHoursAgo).slice(0, 4);
    default:
      return copy.slice(0, 4);
  }
}

export function getTrendById(id: string) {
  return trends.find((trend) => trend.id === id);
}

export function searchTrends(query: string, region: RegionFilter, category: TrendCategory | "Alle") {
  const normalized = query.trim().toLowerCase();

  return trends.filter((trend) => {
    const regionMatch = region === "Hele verden" ? true : trend.region === region;
    const categoryMatch = category === "Alle" ? true : trend.category === category;
    const queryMatch =
      normalized.length === 0
        ? true
        : [
            trend.name,
            trend.country,
            trend.category,
            trend.region,
            trend.description,
            trend.aiSummary,
            trend.opportunity,
            ...trend.useCases,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized);

    return regionMatch && categoryMatch && queryMatch;
  });
}

export { categories, regions };
