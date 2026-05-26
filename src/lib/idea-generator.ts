import { Trend } from "@/lib/types";

export type ProjectIdea = {
  title: string;
  format: "Webapp" | "App" | "Nettside";
  audience: string;
  whyNow: string;
  mvp: string[];
  monetization: string;
  firstSteps: string[];
  sourceTrendIds: string[];
  marketOpportunity: Array<{
    market: "Norsk" | "Nordisk" | "Europeisk" | "Global";
    profitabilityScore: number;
    note: string;
  }>;
  investorPotential: string;
  competitors: string[];
};

function topWords(trend: Trend) {
  const text = `${trend.navn} ${trend.oppsummering}`.toLowerCase();
  const picks = ["ai", "creator", "community", "premium", "automation", "collector", "wellness", "retail", "short form", "local"];
  return picks.filter((item) => text.includes(item)).slice(0, 3);
}

function formatForTrend(trend: Trend): ProjectIdea["format"] {
  if (trend.kategori === "Teknologi" || trend.kategori === "Sosiale medier") return "Webapp";
  if (trend.kategori === "Musikk" || trend.kategori === "Mote" || trend.kategori === "Mat") return "Webapp";
  if (trend.kategori === "Helse" || trend.kategori === "Sport") return "App";
  return "Nettside";
}

function scoreMarket(trend: Trend, market: ProjectIdea["marketOpportunity"][number]["market"]) {
  const techHeavy = trend.kategori === "Teknologi" || trend.kategori === "Sosiale medier";
  const consumerHeavy = trend.kategori === "Musikk" || trend.kategori === "Mote" || trend.kategori === "Mat";
  const communityHeavy = trend.kategori === "Livsstil" || trend.kategori === "Sport" || trend.kategori === "Helse";

  const baseScores: Record<ProjectIdea["marketOpportunity"][number]["market"], number> = {
    Norsk: consumerHeavy ? 7 : communityHeavy ? 6 : 5,
    Nordisk: consumerHeavy ? 7 : communityHeavy ? 7 : 6,
    Europeisk: techHeavy ? 9 : consumerHeavy ? 8 : 7,
    Global: techHeavy ? 10 : consumerHeavy ? 8 : 7
  };

  const noteMap: Record<ProjectIdea["marketOpportunity"][number]["market"], string> = {
    Norsk: "Sterkest hvis du løser en tydelig nisje og bygger tillit raskt i et lite, presist marked.",
    Nordisk: "God skaleringsbro hvis produktet kan standardiseres på tvers av språk og kultur.",
    Europeisk: "Attraktivt dersom du har distribusjon, innholdsstrategi eller partnerkanaler som kan krysse land.",
    Global: "Best når produktet er digitalt, lett å distribuere og kan monetiseres som abonnement eller lisens."
  };

  const score = Math.max(1, Math.min(10, Math.round((baseScores[market] + trend.trendScore / 20) / 2)));
  return { score, note: noteMap[market] };
}

function competitorLandscape(trend: Trend) {
  const competitors: Record<string, string[]> = {
    Musikk: ["Generiske AI-musikkverktøy", "Creator-suite plattformer", "Videoredigeringsapper med lydfunksjon"],
    Teknologi: ["No-code automasjonsverktøy", "AI-copilots i brede SaaS-pakker", "Små vertikale workflow-verktøy"],
    Spill: ["Retro-markedsplasser", "Nisjefora og Discord-samfunn", "Samlernettsteder"],
    Mote: ["D2C-merker med creator-distribusjon", "Shopify-baserte drops", "Kuraterte marketplace-butikker"],
    Mat: ["FMCG-startups", "Helseorienterte D2C-merker", "Dagligvareprivate labels"],
    Livsstil: ["Nyhetsbrev", "Community-apper", "Content brands"],
    "Sosiale medier": ["Trend analytics-tools", "Publishing tools", "Creator economy dashboards"],
    Sport: ["Training apps", "Klubbplattformer", "Utstyrsmerker med medlemskap"],
    Helse: ["Habit-trackere", "Velværecoacher", "Telehealth-light services"]
  };

  return competitors[trend.kategori] ?? ["Generiske nisjekonkurrenter", "Indirekte nyhets-/communitykanaler"];
}

function investorPotential(trend: Trend, format: ProjectIdea["format"]) {
  const score = trend.trendScore >= 85 ? "sterk" : trend.trendScore >= 75 ? "moderat" : "tidlig";
  const globality = trend.region === "Hele verden" || trend.region === "Europa" || trend.kategori === "Teknologi";
  const recurring = format === "Webapp" || trend.kategori === "Teknologi" || trend.kategori === "Sosiale medier";

  if (globality && recurring) {
    return `God investor-case: ${score} signaler, tydelig gjentakende inntekt og mulighet for internasjonal skalering.`;
  }

  if (recurring) {
    return "Mulig investor-case, særlig hvis du kan vise at produktet har gjentakende inntekt og distribusjon utenfor hjemmemarkedet.";
  }

  return "Mulig bootstrappet case først; investorer blir mer aktuelle når du beviser etterspørsel, marginer og en kanal som kan skaleres.";
}

function buildIdea(trend: Trend): ProjectIdea {
  const words = topWords(trend);
  const core = words[0] ?? trend.kategori.toLowerCase();
  const format = formatForTrend(trend);

  const titles: Record<string, string> = {
    Musikk: "AI Creator Studio for Music",
    Teknologi: "Micro Automation OS",
    Spill: "Retro Game Intelligence Hub",
    Mote: "Premium Drop Lab",
    Mat: "Functional Launch Kitchen",
    Livsstil: "Community Signal Compass",
    "Sosiale medier": "Short-Form Trend Engine",
    Sport: "Performance Tribe Builder",
    Helse: "Wellness Routine Coach"
  };

  const audiences: Record<string, string> = {
    Musikk: "Indie-artister, produsenter og små studios",
    Teknologi: "Små SaaS-team, solo founders og automation-kjøpere",
    Spill: "Spillere, samlere og nisjecommunityer",
    Mote: "D2C-merker, stylister og premium retail",
    Mat: "Nye drikke-/matmerker, dagligvare og D2C founders",
    Livsstil: "Community-led brands og medieprosjekter",
    "Sosiale medier": "Creators, byråer og innholdsgründerne",
    Sport: "Klubber, coacher og utstyrsmerker",
    Helse: "Coacher, helsetjenester og velværebrands"
  };

  return {
    title: titles[trend.kategori] ?? `${trend.kategori} Opportunity`,
    format,
    audience: audiences[trend.kategori] ?? "Tidlige kjøpere i nisjen",
    whyNow: `Trenden har score ${trend.trendScore}, vekst ${trend.vekstProsent.toFixed(1)}% og tydelige signaler fra ${trend.land}. ${trend.oppsummering}`,
    mvp: [
      `Lag en enkel landingsside som forklarer verdien rundt ${core}.`,
      `Bygg én kjernefunksjon som løser det mest presserende behovet i nisjen.`,
      `Koble på et sosialt bevis, et nyhetsbrev eller en delbar rapport.`
    ],
    monetization: trend.kategori === "Teknologi" || trend.kategori === "Sosiale medier" ? "Abonnement + pro-plan" : "Freemium + premium / partnerskap",
    firstSteps: [
      `Intervju 5 potensielle brukere i ${trend.region}.`,
      `Lag 1 MVP-skjerm og test budskapet i sosiale kanaler.`,
      `Mål om du kan få 10 klikk eller 3 interessentsamtaler i løpet av første uke.`
    ],
    sourceTrendIds: [trend.id],
    marketOpportunity: (["Norsk", "Nordisk", "Europeisk", "Global"] as const).map((market) => {
      const result = scoreMarket(trend, market);
      return {
        market,
        profitabilityScore: result.score,
        note: result.note
      };
    }),
    investorPotential: investorPotential(trend, format),
    competitors: competitorLandscape(trend)
  };
}

export function buildProjectIdeas(trends: Trend[]) {
  return trends.slice(0, 6).map((trend) => buildIdea(trend));
}

export function buildPrompt(trends: Trend[], ideas: ProjectIdea[]) {
  const trendLines = trends
    .map((trend, index) => {
      return [
        `${index + 1}. ${trend.navn} (${trend.kategori}, ${trend.region}, ${trend.land})`,
        `   - Score: ${trend.trendScore}/100`,
        `   - Vekst: ${trend.vekstProsent.toFixed(1)}%`,
        `   - Oppsummering: ${trend.oppsummering}`
      ].join("\n");
    })
    .join("\n\n");

  const ideaLines = ideas
    .map((idea, index) => {
      const marketLines = idea.marketOpportunity
        .map((item) => `      • ${item.market}: ${item.profitabilityScore}/10 - ${item.note}`)
        .join("\n");

      return [
        `${index + 1}. ${idea.title} (${idea.format})`,
        `   - Målgruppe: ${idea.audience}`,
        `   - Hvorfor nå: ${idea.whyNow}`,
        `   - Investorer: ${idea.investorPotential}`,
        `   - Konkurrenter: ${idea.competitors.join(" | ")}`,
        `   - Lønnsomhet per marked:\n${marketLines}`,
        `   - Monetisering: ${idea.monetization}`,
        `   - MVP: ${idea.mvp.join(" | ")}`
      ].join("\n");
    })
    .join("\n\n");

  return `Du er en senior produktstrateg og startup-rådgiver.

Jeg bygger et produkt i MoodMarket basert på tidlige trender. Analyser signalene nedenfor og gi meg en konkret, prioriterbar plan.

TRENDINPUT:
${trendLines}

FORSLAG TIL PROSJEKTER:
${ideaLines}

Oppgaven din:
1. Velg det beste prosjektet å starte nå og begrunn valget kort.
2. Foreslå 3 spesifikke USP-er.
3. Lag en MVP-plan for 14 dager med dag-for-dag fokus.
4. Foreslå prisstrategi, første distribusjonskanaler og 5 onboarding-spørsmål til brukertest.
5. Vurder lønnsomhet i norsk, nordisk, europeisk og globalt marked med kort begrunnelse.
6. Kommenter om dette bør bootstrappes eller om investorer kan være aktuelle, og hvorfor.
7. List opp sannsynlige konkurrenter eller substitutter.
8. List opp 5 risikoer og hvordan de kan reduseres.
9. Avslutt med en kort pitch jeg kan bruke mot kunder eller investorer.

Svar strukturert med tydelige overskrifter og konkrete anbefalinger.`;
}