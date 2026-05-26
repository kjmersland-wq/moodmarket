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

export type TrendRegion =
  | "Hele verden"
  | "Europa"
  | "Nord-Amerika"
  | "Sør-Amerika"
  | "Asia"
  | "Afrika"
  | "Oseania";

export interface TrendGrowth {
  h24: number;
  d7: number;
  d30: number;
}

export interface TrendSource {
  name: string;
  url: string;
}

export interface Trend {
  id: string;
  navn: string;
  kategori: TrendCategory;
  region: TrendRegion;
  land: string;
  vekstProsent: number;
  trendScore: number;
  overvaketAv: number;
  styrke: "Lav" | "Moderat" | "Sterk" | "Ekstrem";
  sparkline: number[];
  vekst: TrendGrowth;
  kilder: TrendSource[];
  oppsummering: string;
}
