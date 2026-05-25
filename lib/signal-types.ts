import { RegionFilter, TrendCategory } from "@/lib/types";

export type SignalSourceKey =
  | "reddit"
  | "youtube"
  | "news"
  | "forums"
  | "trends"
  | "tiktok"
  | "x"
  | "podcasts"
  | "newsletters"
  | "github"
  | "marketplaces";

export type SignalItem = {
  id: string;
  topic: string;
  category: TrendCategory;
  region: RegionFilter;
  countries: string[];
  momentum: number;
  competition: number;
  summary: string;
  keywords: string[];
};

export type SignalBatch = {
  source: SignalSourceKey;
  enabled: boolean;
  message: string;
  items: SignalItem[];
};
