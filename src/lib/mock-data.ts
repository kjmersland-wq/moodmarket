import { Trend, TrendCategory, TrendRegion } from "@/lib/types";

const categories: TrendCategory[] = [
  "Musikk",
  "Teknologi",
  "Spill",
  "Mote",
  "Mat",
  "Livsstil",
  "Sosiale medier",
  "Sport",
  "Helse"
];

export const regions: TrendRegion[] = [
  "Hele verden",
  "Europa",
  "Nord-Amerika",
  "Sør-Amerika",
  "Asia",
  "Afrika",
  "Oseania"
];

export const trends: Trend[] = [
  {
    id: "ai-music-copilot",
    navn: "AI Music Copilot",
    kategori: "Musikk",
    region: "Nord-Amerika",
    land: "USA",
    vekstProsent: 47.2,
    trendScore: 91,
    overvaketAv: 18240,
    styrke: "Ekstrem",
    sparkline: [12, 18, 22, 26, 31, 35, 40, 47],
    vekst: { h24: 11.5, d7: 47.2, d30: 189.3 },
    kilder: [
      { name: "Reddit r/WeAreTheMusicMakers", url: "https://reddit.com" },
      { name: "YouTube Shorts", url: "https://youtube.com" }
    ],
    oppsummering:
      "Kreative produsenter deler korte demospor med AI-assistanse, og terskelen for å lansere nye låtidéer har falt kraftig."
  },
  {
    id: "retro-gaming-wave",
    navn: "Retro Gaming Wave",
    kategori: "Spill",
    region: "Asia",
    land: "Japan",
    vekstProsent: 39.8,
    trendScore: 86,
    overvaketAv: 14930,
    styrke: "Sterk",
    sparkline: [9, 11, 15, 18, 24, 27, 32, 40],
    vekst: { h24: 8.2, d7: 39.8, d30: 133.1 },
    kilder: [
      { name: "Forumtråder", url: "https://example.com" },
      { name: "Nyhetssider", url: "https://example.com" }
    ],
    oppsummering:
      "Nostalgi møter ny maskinvare: remakes, emulator-håndholdte og samlerkultur driver interessen i flere markeder samtidig."
  },
  {
    id: "nordic-blues-revival",
    navn: "Nordisk Blues Revival",
    kategori: "Musikk",
    region: "Europa",
    land: "Sverige",
    vekstProsent: 24.1,
    trendScore: 75,
    overvaketAv: 7280,
    styrke: "Moderat",
    sparkline: [5, 7, 8, 10, 12, 15, 20, 24],
    vekst: { h24: 5.1, d7: 24.1, d30: 72.6 },
    kilder: [
      { name: "YouTube Live-opptak", url: "https://youtube.com" },
      { name: "Musikkforum", url: "https://example.com" }
    ],
    oppsummering:
      "Nye artister blander klassisk blues med nordisk stemning, og klipp fra intime livescener sprer seg raskt."
  },
  {
    id: "functional-mushroom-soda",
    navn: "Functional Mushroom Soda",
    kategori: "Mat",
    region: "Nord-Amerika",
    land: "Canada",
    vekstProsent: 31.7,
    trendScore: 80,
    overvaketAv: 10120,
    styrke: "Sterk",
    sparkline: [4, 6, 10, 11, 15, 20, 26, 32],
    vekst: { h24: 6.7, d7: 31.7, d30: 101.2 },
    kilder: [
      { name: "Reddit r/FoodTrends", url: "https://reddit.com" },
      { name: "Bransjenyheter", url: "https://example.com" }
    ],
    oppsummering:
      "Drikker med fokus på energi og velvære får høy deling i urbane miljøer, særlig blant unge voksne."
  },
  {
    id: "micro-saas-automations",
    navn: "Micro SaaS Automations",
    kategori: "Teknologi",
    region: "Hele verden",
    land: "Global",
    vekstProsent: 43.5,
    trendScore: 89,
    overvaketAv: 21300,
    styrke: "Ekstrem",
    sparkline: [11, 13, 16, 20, 25, 31, 37, 44],
    vekst: { h24: 9.8, d7: 43.5, d30: 151.4 },
    kilder: [
      { name: "Product forums", url: "https://example.com" },
      { name: "YouTube builders", url: "https://youtube.com" }
    ],
    oppsummering:
      "Flere små team bygger nisjeverktøy med AI-støtte, noe som gir rask produktlansering og tydelige inntektsmodeller."
  },
  {
    id: "street-recovery-running",
    navn: "Street Recovery Running",
    kategori: "Helse",
    region: "Sør-Amerika",
    land: "Brasil",
    vekstProsent: 22.6,
    trendScore: 70,
    overvaketAv: 6530,
    styrke: "Moderat",
    sparkline: [6, 6, 9, 10, 12, 15, 18, 23],
    vekst: { h24: 4.9, d7: 22.6, d30: 65.8 },
    kilder: [
      { name: "Lokale forums", url: "https://example.com" },
      { name: "Sosiale medier", url: "https://example.com" }
    ],
    oppsummering:
      "Løpeklubber kombinerer trening med aktiv restitusjon i bymiljø, og formatet sprer seg i korte videoformater."
  },
  {
    id: "afrofusion-style-labs",
    navn: "Afrofusion Style Labs",
    kategori: "Mote",
    region: "Afrika",
    land: "Nigeria",
    vekstProsent: 36.4,
    trendScore: 84,
    overvaketAv: 12010,
    styrke: "Sterk",
    sparkline: [7, 10, 12, 15, 21, 24, 30, 36],
    vekst: { h24: 7.4, d7: 36.4, d30: 122.4 },
    kilder: [
      { name: "Motenyheter", url: "https://example.com" },
      { name: "YouTube creators", url: "https://youtube.com" }
    ],
    oppsummering:
      "Lokale designere får global synlighet via kortformat, og etterspørselen etter sterke fargepaletter stiger."
  },
  {
    id: "ocean-cleanup-creators",
    navn: "Ocean Cleanup Creators",
    kategori: "Livsstil",
    region: "Oseania",
    land: "Australia",
    vekstProsent: 18.3,
    trendScore: 67,
    overvaketAv: 5870,
    styrke: "Moderat",
    sparkline: [4, 5, 6, 8, 10, 12, 15, 18],
    vekst: { h24: 3.7, d7: 18.3, d30: 49.6 },
    kilder: [
      { name: "Community forums", url: "https://example.com" },
      { name: "Nyhetsartikler", url: "https://example.com" }
    ],
    oppsummering:
      "Skaperdrevne miljøprosjekter får høy tillit og deling fordi effekten kan dokumenteres visuelt fra uke til uke."
  }
];

export const globalOverview = [
  { region: "Nord-Amerika", score: 88, signaler: 142 },
  { region: "Europa", score: 79, signaler: 116 },
  { region: "Asia", score: 83, signaler: 134 },
  { region: "Sør-Amerika", score: 71, signaler: 92 },
  { region: "Afrika", score: 76, signaler: 99 },
  { region: "Oseania", score: 68, signaler: 57 }
] as const;

export function getTrendById(id: string) {
  return trends.find((trend) => trend.id === id);
}

export function getTopByGrowth(limit = 4) {
  return [...trends].sort((a, b) => b.vekstProsent - a.vekstProsent).slice(0, limit);
}

export function getEarlySignals(limit = 4) {
  return [...trends]
    .sort((a, b) => b.vekst.h24 * 0.6 + b.vekst.d7 * 0.4 - (a.vekst.h24 * 0.6 + a.vekst.d7 * 0.4))
    .slice(0, limit);
}

export function getMostWatched(limit = 4) {
  return [...trends].sort((a, b) => b.overvaketAv - a.overvaketAv).slice(0, limit);
}

export function getNewSignals(limit = 4) {
  return [...trends]
    .sort((a, b) => b.vekst.h24 - a.vekst.h24)
    .slice(0, limit);
}

export function filterTrends(region?: string, kategori?: string, sok?: string) {
  return trends.filter((trend) => {
    const regionMatch =
      !region || region === "Hele verden" || trend.region === region || trend.region === "Hele verden";
    const kategoriMatch = !kategori || kategori === "Alle" || trend.kategori === kategori;
    const sokMatch =
      !sok || trend.navn.toLowerCase().includes(sok.toLowerCase()) || trend.land.toLowerCase().includes(sok.toLowerCase());

    return regionMatch && kategoriMatch && sokMatch;
  });
}

export { categories };
