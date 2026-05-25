export type TrendCategory =
  | "Musikk"
  | "Teknologi"
  | "Spill"
  | "Mote"
  | "Mat"
  | "Livsstil"
  | "Sosiale medier"
  | "Sport"
  | "Helse";

export type RegionFilter =
  | "Hele verden"
  | "Europa"
  | "Nord-Amerika"
  | "Sor-Amerika"
  | "Asia"
  | "Afrika"
  | "Oseania";

export type TrendSectionKey =
  | "trendraketter"
  | "tidlige-signaler"
  | "verdensoversikt"
  | "mest-overvaket"
  | "nye-signaler";

export type TrendSource = {
  title: string;
  url: string;
  sourceType: "Reddit" | "YouTube" | "Nyheter" | "Forum" | "Trendmotor";
};

export type Trend = {
  id: string;
  name: string;
  category: TrendCategory;
  country: string;
  region: RegionFilter;
  growthPercent: number;
  trendScore: number;
  strength: number;
  sparkline: number[];
  watchedBy: number;
  launchedHoursAgo: number;
  growth24h: number;
  growth7d: number;
  growth30d: number;
  aiSummary: string;
  sources: TrendSource[];
};

export type CountryHeat = {
  country: string;
  code: string;
  x: number;
  y: number;
  heat: number;
  label: string;
  featuredTrends: string[];
};
