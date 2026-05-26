import { Trend, TrendCategory } from "@/lib/types";

export type RegionalProfitability = {
  region: string;
  tam: string;
  sam: string;
  arpa: string;
  grossMargin: string;
  ltvCac: string;
  paybackMonths: string;
  note: string;
};

export type Competitor = {
  name: string;
  type: "Direkte" | "Indirekte" | "Enterprise";
  startingPrice: string;
  strengths: string;
  weaknesses: string;
};

const profitabilityByCategory: Partial<Record<TrendCategory, RegionalProfitability[]>> = {
  "Okonomi bedrift": [
    {
      region: "Norge",
      tam: "~€120M",
      sam: "~€18M",
      arpa: "€150–400/mnd",
      grossMargin: "82–88%",
      ltvCac: "3.5–5x",
      paybackMonths: "8–12",
      note: "Høy betalingsvilje og sterk digitalisering. Prioritert for PMF og referanser.",
    },
    {
      region: "Norden",
      tam: "~€550M",
      sam: "~€75M",
      arpa: "€150–400/mnd",
      grossMargin: "82–88%",
      ltvCac: "3.0–4.5x",
      paybackMonths: "9–14",
      note: "Skalering via partnerdrevne kanaler, regnskapsmiljø og ERP-integrasjoner.",
    },
    {
      region: "Europa",
      tam: "~€5.4B",
      sam: "~€600M",
      arpa: "€100–350/mnd",
      grossMargin: "80–87%",
      ltvCac: "2.8–4.0x",
      paybackMonths: "10–18",
      note: "Sterk vekst, krever lokal tilpasning. DACH, UK og Benelux er størst.",
    },
    {
      region: "Globalt",
      tam: "~€1.4B (cashflow SaaS)",
      sam: "~€3B (SMB fintech)",
      arpa: "$80–300/mnd",
      grossMargin: "78–86%",
      ltvCac: "2.5–4.0x",
      paybackMonths: "10–20",
      note: "Stor konkurranse. Krever klar differensiering og lokal GTM-playbook.",
    },
  ],
  Teknologi: [
    {
      region: "Norge",
      tam: "~€200M",
      sam: "~€30M",
      arpa: "€200–500/mnd",
      grossMargin: "83–90%",
      ltvCac: "3.5–5x",
      paybackMonths: "7–11",
      note: "Teknologisk moden kundermasse med høy betalingsvilje for verktøy.",
    },
    {
      region: "Norden",
      tam: "~€900M",
      sam: "~€120M",
      arpa: "€200–500/mnd",
      grossMargin: "83–90%",
      ltvCac: "3.2–5x",
      paybackMonths: "8–13",
      note: "Sterkt tech-startup-miljø. Integrasjoner og API-first vinner.",
    },
    {
      region: "Europa",
      tam: "~€8B",
      sam: "~€900M",
      arpa: "€100–400/mnd",
      grossMargin: "81–89%",
      ltvCac: "2.8–4.5x",
      paybackMonths: "9–16",
      note: "EU-regulering (AI Act, GDPR) skaper behov for compliance-funksjonalitet.",
    },
    {
      region: "Globalt",
      tam: "~€50B+ (developer tools/SaaS)",
      sam: "~€5B",
      arpa: "$100–400/mnd",
      grossMargin: "80–88%",
      ltvCac: "3.0–5x",
      paybackMonths: "8–18",
      note: "Høy konkurranse, men store prisforskjeller mellom regioner.",
    },
  ],
};

const defaultProfitability: RegionalProfitability[] = [
  {
    region: "Norge",
    tam: "~€80–200M (avh. av segment)",
    sam: "~€10–30M",
    arpa: "€100–300/mnd",
    grossMargin: "80–88%",
    ltvCac: "3–5x",
    paybackMonths: "8–14",
    note: "Høy digitalmoden SMB-base. Prioritert for tidlig PMF og referanser.",
  },
  {
    region: "Norden",
    tam: "~€400–900M",
    sam: "~€50–120M",
    arpa: "€100–300/mnd",
    grossMargin: "80–88%",
    ltvCac: "2.8–4.5x",
    paybackMonths: "9–16",
    note: "Skalering via partnerkanaler og ERP-integrasjoner.",
  },
  {
    region: "Europa",
    tam: "~€3–8B",
    sam: "~€400M–1B",
    arpa: "€80–250/mnd",
    grossMargin: "78–86%",
    ltvCac: "2.5–4x",
    paybackMonths: "10–20",
    note: "Krever lokal tilpasning per land. DACH og UK er størst.",
  },
  {
    region: "Globalt",
    tam: "~€10–70B (SMB programvare)",
    sam: "~€1–5B",
    arpa: "$60–250/mnd",
    grossMargin: "76–85%",
    ltvCac: "2.5–4x",
    paybackMonths: "12–24",
    note: "Høy konkurranse. Vinn med nisje, AI-funksjonalitet og rask onboarding.",
  },
];

const competitorsByCategory: Partial<Record<TrendCategory, Competitor[]>> = {
  "Okonomi bedrift": [
    {
      name: "Fathom",
      type: "Direkte",
      startingPrice: "$53/mnd",
      strengths: "3-way forecasting, visuelle dashboards, Xero/QBO-integrasjon",
      weaknesses: "Begrenset nordisk tilpasning og lokale datakilder",
    },
    {
      name: "Futrli",
      type: "Direkte",
      startingPrice: "£19/mnd",
      strengths: "Daglig scenario-modellering, SMB-fokus",
      weaknesses: "Svak tilstedeværelse utenfor UK",
    },
    {
      name: "Float",
      type: "Direkte",
      startingPrice: "$59/mnd",
      strengths: "Enkel cashflow-prognose, intuitivt grensesnitt",
      weaknesses: "Mangler dybde i analyse og AI-innsikt",
    },
    {
      name: "Syft Analytics",
      type: "Direkte",
      startingPrice: "$30/mnd",
      strengths: "Multi-entitet, dashboards, regnskapsintegrasjon",
      weaknesses: "Kompleks onboarding for nye brukere",
    },
    {
      name: "Commitly",
      type: "Direkte",
      startingPrice: "€45/mnd",
      strengths: "EU/DACH-fokus, sanntidsplanlegging, scenario-analyse",
      weaknesses: "Liten markedsandel i Norden",
    },
    {
      name: "Xero / Analytics Plus",
      type: "Indirekte",
      startingPrice: "£14/mnd+",
      strengths: "Alt-i-ett regnskap, stor global brukerbase",
      weaknesses: "Ikke spesialist på cashflow-innsikt eller trendanalyse",
    },
    {
      name: "Visma / Tripletex",
      type: "Indirekte",
      startingPrice: "NOK 299/mnd+",
      strengths: "Norsk markedsleder, sterk regnskapsfunksjonalitet",
      weaknesses: "Svak trendanalyse, lite AI og prediktiv innsikt",
    },
    {
      name: "Kyriba / Nomentia",
      type: "Enterprise",
      startingPrice: "Etter avtale",
      strengths: "Treasury-dybde, enterprise-grade, multibankintegrasjon",
      weaknesses: "For kostbart og komplekst for SMB-markedet",
    },
  ],
  Teknologi: [
    {
      name: "GitHub Copilot / Cursor",
      type: "Direkte",
      startingPrice: "$10–19/mnd",
      strengths: "Bredt adopert, sterk AI-integrasjon",
      weaknesses: "Generalistverktøy, ingen bransjespesifikk innsikt",
    },
    {
      name: "Vercel / Netlify",
      type: "Indirekte",
      startingPrice: "$0–20/mnd+",
      strengths: "Sterk deploymentplatform med metrics",
      weaknesses: "Ikke fokus på trendanalyse eller markedsinnsikt",
    },
    {
      name: "Datadog / New Relic",
      type: "Enterprise",
      startingPrice: "Etter avtale",
      strengths: "Observability og enterprise-grade monitoring",
      weaknesses: "For komplekst og dyrt for tidlige produktteam",
    },
  ],
};

const defaultCompetitors: Competitor[] = [
  {
    name: "Markedsledere (segment)",
    type: "Direkte",
    startingPrice: "€20–100/mnd",
    strengths: "Stor brukerbase, mange integrasjoner",
    weaknesses: "Generalistfokus, lite AI og lokal tilpasning",
  },
  {
    name: "Nisjeaktører (EU)",
    type: "Direkte",
    startingPrice: "€30–80/mnd",
    strengths: "Lokal tilpasning, nisjeforståelse",
    weaknesses: "Begrenset skalerbarhet og markedsrekkevidde",
  },
  {
    name: "Store plattformer",
    type: "Indirekte",
    startingPrice: "€10–50/mnd",
    strengths: "Alt-i-ett løsninger, etablert distribusjon",
    weaknesses: "Ikke spesialisert på dette segmentet",
  },
];

export function getProfitabilityData(category: TrendCategory): RegionalProfitability[] {
  return profitabilityByCategory[category] ?? defaultProfitability;
}

export function getCompetitors(category: TrendCategory): Competitor[] {
  return competitorsByCategory[category] ?? defaultCompetitors;
}

export function generateTrendPrompt(trend: Trend): string {
  const profitability = getProfitabilityData(trend.category);
  const competitors = getCompetitors(trend.category);

  const profitabilityBlock = profitability
    .map(
      (p) =>
        `• ${p.region}: TAM ${p.tam}, SAM ${p.sam}, ARPA ${p.arpa}, Gross Margin ${p.grossMargin}, LTV/CAC ${p.ltvCac}, Payback ${p.paybackMonths} mnd. ${p.note}`
    )
    .join("\n");

  const competitorsBlock = competitors
    .map(
      (c) =>
        `• ${c.name} [${c.type}] – Fra ${c.startingPrice}. Styrker: ${c.strengths}. Svakheter: ${c.weaknesses}`
    )
    .join("\n");

  return `Du er en senior produktdesigner, UX-writer og fullstack-arkitekt.

TREND: ${trend.name}
Kategori: ${trend.category} | Region: ${trend.region} | Land: ${trend.country}
Trendscore: ${trend.trendScore}/100 | Styrke: ${trend.strength}/100
Vekst: +${trend.growth24h}% (24t) / +${trend.growth7d}% (7d) / +${trend.growth30d}% (30d)

BESKRIVELSE
${trend.description}

HVORFOR VOKSER DENNE?
${trend.aiSummary}

MARKEDSBETYDNING
${trend.opportunity}

USE CASES
${trend.useCases.join(", ")}

LØNNSOMHETSANALYSE PER REGION
${profitabilityBlock}

KONKURRENTER
${competitorsBlock}

OPPGAVE
Bygg en produksjonsklar webapp som kapitaliserer på denne trenden.

Lever:
1) Informasjonsarkitektur og sidekart
2) Datamodell og API-kontrakter
3) UI-komponentliste med mørkt glassmorphism-design (Next.js + TypeScript + Tailwind)
4) Funksjonell spec: Trendscore, vekstgraf, scenario-analyse, kildeliste, regionpanel
5) Kopierbar "master prompt"-generator (for viderebruk i Lovable/Claude/GPT)
6) Go-to-market-anbefaling per region (Norge → Norden → Europa → Globalt)
7) 3 eksempelrapporter med scenario base/bull/bear

Teknisk stack: Next.js + TypeScript + Tailwind + Shadcn/UI
Språk: Norsk default, i18n-klar
Design: Mørkt premium dashboard, glassmorphism, fintech-estetikk`;
}
