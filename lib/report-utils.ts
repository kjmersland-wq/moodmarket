import { jsPDF } from "jspdf";
import { Trend } from "@/lib/types";

export type ProductFormat = "App" | "Nettside" | "Webapp";
export type IncomePotential = "Lav" | "Middels" | "Hoy";
export type CostLevel = "Lavt" | "Middels" | "Hoyt";
export type MarketSize = "Norge" | "Norden" | "Europa" | "Globalt";
export type CompetitionLevel = "Lav" | "Middels" | "Hoy";

export type ProductIdea = {
  id: string;
  title: string;
  format: ProductFormat;
  targetAudience: string;
  pricingModel: string;
  description: string;
  valueProposition: string;
  launchTimeline: string;
  revenueLowNok: number;
  revenueHighNok: number;
  monthlyFixedCostNok: number;
  setupCostNok: number;
  confidence: "Lav" | "Moderat" | "Hoy";
};

export type IdeaProfitabilityOverview = {
  incomePotential: IncomePotential;
  costLevel: CostLevel;
  breakEvenEstimate: string;
  marketSize: MarketSize;
  competitionLevel: CompetitionLevel;
  priorityScore: number;
};

export type MonthlyProjection = {
  month: number;
  bestNok: number;
  baseNok: number;
  worstNok: number;
};

export type IdeaFinancials = {
  monthly: MonthlyProjection[];
  sumBestNok: number;
  sumBaseNok: number;
  sumWorstNok: number;
  totalCost12mNok: number;
  breakEvenMonth: number | null;
  roi12mBasePercent: number;
};

export type TrendReportEntry = {
  trend: Trend;
  ideas: ProductIdea[];
};

const categoryTemplates: Record<
  string,
  Array<
    Omit<
      ProductIdea,
      "id" | "revenueLowNok" | "revenueHighNok" | "monthlyFixedCostNok" | "setupCostNok" | "confidence"
    >
  >
> = {
  default: [
    {
      title: "Nisjeverifiserer",
      format: "Webapp",
      targetAudience: "Tidligfase gründere og produktteam",
      pricingModel: "Abonnement per team",
      description: "Tester ettersporsel med venteliste, brukersignaler og betalingsinteresse i markedet.",
      valueProposition: "Reduserer risiko ved a validere hvilke funksjoner brukerne faktisk vil betale for.",
      launchTimeline: "2-4 uker",
    },
    {
      title: "Sammenligningsportal",
      format: "Nettside",
      targetAudience: "Soketrafikk og innholdsbrukere",
      pricingModel: "Annonser, affiliates og lead-salg",
      description: "En konkret sammenligningsside med guider, rangeringer og tydelig kjopshjelp i kategorien.",
      valueProposition: "Bygger tidlig organisk trafikk og skaper raske inntekter via partnerskap.",
      launchTimeline: "1-3 uker",
    },
    {
      title: "Mobil coach",
      format: "App",
      targetAudience: "Forbrukere og entusiaster",
      pricingModel: "Freemium og premium-medlemskap",
      description: "En handlingsapp med daglige anbefalinger, progresjon og varsler tilpasset trendens behov.",
      valueProposition: "Skaper hoy brukshyppighet og tydelig oppgraderingsvei til abonnement.",
      launchTimeline: "4-6 uker",
    },
    {
      title: "B2B onboarding-hub",
      format: "Webapp",
      targetAudience: "SMB og partnere",
      pricingModel: "SaaS + oppstartsavgift",
      description: "Automatiserer onboarding, maloppfolging og rapportering for nye kunder i nisjen.",
      valueProposition: "Korter ned tid til verdi og oker betalingsvilje i bedriftssegmentet.",
      launchTimeline: "5-8 uker",
    },
    {
      title: "Micro-kurs univers",
      format: "Nettside",
      targetAudience: "Brukere som vil lare raskt i ny nisje",
      pricingModel: "Kurspakker og medlemskap",
      description: "Selger korte kurs, maler og verktoy som matcher trendens nyeste behov.",
      valueProposition: "Konverterer trendinteresse til repeterende digitalt salg med lave driftskostnader.",
      launchTimeline: "2-5 uker",
    },
  ],
  "Okonomi privat": [
    {
      title: "Hverdagsokonomi Coach",
      format: "App",
      targetAudience: "Privatpersoner og familier",
      pricingModel: "Freemium + premium-abonnement",
      description: "Gir budsjetter, spareforslag, abonnementsstopp og ukentlig handlingsliste for bedre privatokonomi.",
      valueProposition: "Frigjor penger raskt med konkrete tiltak og tydelig progresjon for brukeren.",
      launchTimeline: "3-5 uker",
    },
    {
      title: "Finansguide Portal",
      format: "Nettside",
      targetAudience: "Soketrafikk og lead-generering",
      pricingModel: "Affiliate, leads og sponsorater",
      description: "Sammenligner produkter, forklarer valg og eier organiske sok rundt kostnadsreduksjon og smarte pengestrategier.",
      valueProposition: "Skaper hoy-intensjon trafikk som kan monetiseres med partneravtaler.",
      launchTimeline: "2-4 uker",
    },
    {
      title: "Okonomioversikt Pro",
      format: "Webapp",
      targetAudience: "Raadgivere og medlemsmiljoer",
      pricingModel: "Abonnement per bruker eller white-label",
      description: "Samler husholdningsdata i dashboard med scenarioplanlegging og mal for bedre kundeoppfolging.",
      valueProposition: "Gir raadgivere bedre beslutningsgrunnlag og hoyere kundeverdi.",
      launchTimeline: "5-8 uker",
    },
    {
      title: "Gjeldsplanlegger Smart",
      format: "App",
      targetAudience: "Husholdninger med flere lan",
      pricingModel: "Abonnement per bruker",
      description: "Prioriterer nedbetaling, varsler forfallsrisiko og simulerer spareeffekt pa renter.",
      valueProposition: "Reduserer rentekostnader med tydelig og motiverende nedbetalingsplan.",
      launchTimeline: "4-6 uker",
    },
    {
      title: "Ung Okonomi Akademi",
      format: "Nettside",
      targetAudience: "Studenter og unge voksne",
      pricingModel: "Kurspakker og medlemskap",
      description: "Praktiske mini-kurs for sparing, skatt og investering i norsk hverdag.",
      valueProposition: "Bygger tillit i et underdekket segment med lav kundetilgangskostnad.",
      launchTimeline: "2-5 uker",
    },
  ],
  "Okonomi bedrift": [
    {
      title: "Likviditetsradar SMB",
      format: "Webapp",
      targetAudience: "SMB-ledere og CFO-funksjoner",
      pricingModel: "B2B SaaS-abonnement",
      description: "Visualiserer kontantstrom, risiko og neste 90 dagers scenarier i et enkelt kontrollrom.",
      valueProposition: "Avdekker kontantpress tidlig og gjør tiltak mer treffsikre for ledelsen.",
      launchTimeline: "5-8 uker",
    },
    {
      title: "Finansinnsikt Hub",
      format: "Nettside",
      targetAudience: "B2B lead-generering",
      pricingModel: "Lead-salg og rapportabonnement",
      description: "Publiserer bransjeinnsikt og skaffer kvalifiserte leads til finans- og regnskapstjenester.",
      valueProposition: "Kombinerer thought leadership med konkret pipeline-bygging.",
      launchTimeline: "2-4 uker",
    },
    {
      title: "Varslingsapp for kostnadslekkasje",
      format: "App",
      targetAudience: "Eiervledede bedrifter",
      pricingModel: "Abonnement per selskap",
      description: "Varsler om avvik, fakturamønstre og kontantpress i et raskt mobilformat for ledelsen.",
      valueProposition: "Hjelper bedrifter stoppe marginlekkasje før den blir kritisk.",
      launchTimeline: "4-6 uker",
    },
    {
      title: "Kredittscore Monitor",
      format: "Webapp",
      targetAudience: "Vekstselskaper og okonomiansvarlige",
      pricingModel: "SaaS + datatillegg",
      description: "Overvaker betalingsatferd, kredittindikatorer og leverandorrisiko i samme panel.",
      valueProposition: "Bedrer finansieringsmuligheter og reduserer tap pa kundesiden.",
      launchTimeline: "6-9 uker",
    },
    {
      title: "Budsjettverksted",
      format: "Nettside",
      targetAudience: "SMB uten eget finance-team",
      pricingModel: "Kurs, malpakker og konsultasjoner",
      description: "Selger praktiske budsjettmaler og steg-for-steg oppsett tilpasset norske bedrifter.",
      valueProposition: "Leverer rask verdi med lav implementeringsfriksjon.",
      launchTimeline: "2-5 uker",
    },
  ],
  Ferie: [
    {
      title: "Reiseplanlegger Nisje",
      format: "App",
      targetAudience: "Reisende og turister",
      pricingModel: "Freemium + partnerprovisjon",
      description: "Setter sammen itineraries, lokale anbefalinger og sesongbaserte valg for nye reisetrender.",
      valueProposition: "Gjor planlegging enklere og oker konvertering til bookingpartnere.",
      launchTimeline: "3-5 uker",
    },
    {
      title: "Destinasjonsportal",
      format: "Nettside",
      targetAudience: "Sok og innholdsmarkeder",
      pricingModel: "Affiliate og sponsorplassering",
      description: "Bygger autoritet i en tidlig reisevertikal med guider, sammenligninger og bookingtrafikk.",
      valueProposition: "Skaper langsiktig trafikk med hoy kommersiell intensjon.",
      launchTimeline: "2-4 uker",
    },
    {
      title: "B2B Retreat Planner",
      format: "Webapp",
      targetAudience: "Bedrifter og arrangorer",
      pricingModel: "Prosjektavgift + abonnement",
      description: "Hjelper team med a planlegge retreat, logistikk og leverandorvalg i ett verktoy.",
      valueProposition: "Reduserer koordinasjonskostnad og feil i komplekse bestillinger.",
      launchTimeline: "5-8 uker",
    },
    {
      title: "Roadtrip Budsjettapp",
      format: "App",
      targetAudience: "Familier og vennegrupper",
      pricingModel: "Freemium + premium-planer",
      description: "Beregner kostnader for drivstoff, bom, overnatting og aktiviteter i samme plan.",
      valueProposition: "Gir forutsigbar ferieokonomi og forbedrer reiseopplevelsen.",
      launchTimeline: "4-6 uker",
    },
    {
      title: "Remote Work Escapes",
      format: "Nettside",
      targetAudience: "Digitale nomader og fjernarbeidere",
      pricingModel: "Partnerprovisjon + medlemskap",
      description: "Kuraterer destinasjoner med coworking, bolig og visuminformasjon.",
      valueProposition: "Treffer et betalingsvillig segment med konkrete beslutningsbehov.",
      launchTimeline: "2-5 uker",
    },
  ],
  Hobby: [
    {
      title: "Enthusiast Community App",
      format: "App",
      targetAudience: "Entusiaster og medlemsmiljoer",
      pricingModel: "Medlemskap og premium-funksjoner",
      description: "Knytter hobbybrukere sammen med logging, innhold, kjøp og community-funksjoner.",
      valueProposition: "Bygger sterk tilhorighet og repeterende medlemsinntekt.",
      launchTimeline: "3-5 uker",
    },
    {
      title: "Nisjeinnhold Side",
      format: "Nettside",
      targetAudience: "Sok og affiliate-marked",
      pricingModel: "Affiliate, annonser og kurs",
      description: "Bygger organisk trafikk gjennom guider, anmeldelser og beste praksis rundt hobbysegmentet.",
      valueProposition: "Monetiserer ettersporsel med flere inntektsstrommer.",
      launchTimeline: "2-4 uker",
    },
    {
      title: "Workshop Manager",
      format: "Webapp",
      targetAudience: "Kursleverandorer og butikker",
      pricingModel: "Abonnement og billettavgift",
      description: "Drifter kurs, events, medlemskap og salg i hobby- og makersegmenter.",
      valueProposition: "Samler drift og salg i ett operativt verktoy.",
      launchTimeline: "5-8 uker",
    },
    {
      title: "Prosjektjournal App",
      format: "App",
      targetAudience: "Maker- og DIY-miljo",
      pricingModel: "Freemium + premium",
      description: "Dokumenterer fremdrift, materialkost og delbare prosjektmaler.",
      valueProposition: "Skaper daglig engasjement og tydelig premium-oppgradering.",
      launchTimeline: "4-6 uker",
    },
    {
      title: "Hobby Markedsplass Lite",
      format: "Webapp",
      targetAudience: "Smaskala skapere",
      pricingModel: "Transaksjonsgebyr",
      description: "Selger nicheprodukter, kit og digitale oppskrifter i samme løsning.",
      valueProposition: "Gjor det enkelt a tjene penger pa hobbyinteresse.",
      launchTimeline: "6-9 uker",
    },
  ],
};

const marketSizeByCategory: Record<string, MarketSize> = {
  Musikk: "Globalt",
  Teknologi: "Globalt",
  Spill: "Globalt",
  Mote: "Europa",
  Mat: "Norden",
  Livsstil: "Europa",
  "Sosiale medier": "Globalt",
  Sport: "Europa",
  Helse: "Europa",
  "Okonomi privat": "Norden",
  "Okonomi bedrift": "Europa",
  Ferie: "Globalt",
  Hobby: "Europa",
};

function formatToNok(value: number) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}

function round(value: number) {
  return Math.round(value);
}

function estimateBaseMonthlyRevenue(trend: Trend) {
  const momentum = trend.trendScore * 0.7 + trend.strength * 0.35 + trend.growth24h * 0.9 + trend.growth7d * 0.18;
  return Math.round(15000 + momentum * 420);
}

function confidenceFromTrend(trend: Trend): ProductIdea["confidence"] {
  if (trend.trendScore >= 88 && trend.strength >= 80) return "Hoy";
  if (trend.trendScore >= 76) return "Moderat";
  return "Lav";
}

function estimateCostProfile(format: ProductFormat, confidence: ProductIdea["confidence"]) {
  const confidenceFactor = confidence === "Hoy" ? 1.2 : confidence === "Moderat" ? 1 : 0.82;

  const baseProfile =
    format === "App"
      ? { setupCostNok: 320000, monthlyFixedCostNok: 58000 }
      : format === "Webapp"
        ? { setupCostNok: 390000, monthlyFixedCostNok: 72000 }
        : { setupCostNok: 210000, monthlyFixedCostNok: 46000 };

  return {
    setupCostNok: round(baseProfile.setupCostNok * confidenceFactor),
    monthlyFixedCostNok: round(baseProfile.monthlyFixedCostNok * confidenceFactor),
  };
}

function monthlyRamp(month: number) {
  const growth = 0.48 + month * 0.065;
  return Math.min(1.28, growth);
}

function seasonalFactor(month: number) {
  const seasonal = 1 + Math.sin((month / 12) * Math.PI * 2 - Math.PI / 2) * 0.06;
  return seasonal;
}

function incomePotentialFromRevenue(centerMonthlyNok: number): IncomePotential {
  if (centerMonthlyNok >= 110000) return "Hoy";
  if (centerMonthlyNok >= 70000) return "Middels";
  return "Lav";
}

function costLevelFromAnnualCost(totalCost12mNok: number): CostLevel {
  if (totalCost12mNok <= 900000) return "Lavt";
  if (totalCost12mNok <= 1350000) return "Middels";
  return "Hoyt";
}

function competitionLevelFromTrend(trend: Trend): CompetitionLevel {
  const pressure = trend.watchedBy / 100 + trend.trendScore / 100;
  if (pressure >= 1.5) return "Hoy";
  if (pressure >= 1.1) return "Middels";
  return "Lav";
}

function scoreForIncomePotential(level: IncomePotential) {
  if (level === "Hoy") return 92;
  if (level === "Middels") return 74;
  return 52;
}

function scoreForCostLevel(level: CostLevel) {
  if (level === "Lavt") return 90;
  if (level === "Middels") return 72;
  return 50;
}

function scoreForCompetition(level: CompetitionLevel) {
  if (level === "Lav") return 88;
  if (level === "Middels") return 70;
  return 52;
}

function scoreForBreakEven(month: number | null) {
  if (month === null) return 40;
  if (month <= 4) return 95;
  if (month <= 7) return 82;
  if (month <= 10) return 68;
  return 55;
}

function clampScore(value: number) {
  return Math.max(1, Math.min(100, value));
}

export function getProductIdeasForTrend(trend: Trend): ProductIdea[] {
  const templates = categoryTemplates[trend.category] ?? categoryTemplates.default;
  const base = estimateBaseMonthlyRevenue(trend);
  const multipliers = [0.72, 0.86, 1, 1.16, 1.32];
  const confidence = confidenceFromTrend(trend);

  return templates.map((template, index) => {
    const center = Math.round(base * multipliers[index]);
    const revenueLowNok = Math.round(center * 0.65);
    const revenueHighNok = Math.round(center * 1.45);
    const costs = estimateCostProfile(template.format, confidence);

    return {
      id: `${trend.id}-${index}`,
      ...template,
      revenueLowNok,
      revenueHighNok,
      monthlyFixedCostNok: costs.monthlyFixedCostNok,
      setupCostNok: costs.setupCostNok,
      confidence,
    };
  });
}

export function calculateIdeaFinancials(idea: ProductIdea): IdeaFinancials {
  const center = (idea.revenueLowNok + idea.revenueHighNok) / 2;

  const monthly = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const baseNok = round(center * monthlyRamp(month) * seasonalFactor(month));
    const bestNok = round(baseNok * 1.34);
    const worstNok = round(baseNok * 0.67);
    return { month, baseNok, bestNok, worstNok };
  });

  const sumBaseNok = monthly.reduce((sum, item) => sum + item.baseNok, 0);
  const sumBestNok = monthly.reduce((sum, item) => sum + item.bestNok, 0);
  const sumWorstNok = monthly.reduce((sum, item) => sum + item.worstNok, 0);
  const totalCost12mNok = idea.setupCostNok + idea.monthlyFixedCostNok * 12;

  let cumulative = -idea.setupCostNok;
  let breakEvenMonth: number | null = null;

  for (const item of monthly) {
    cumulative += item.baseNok - idea.monthlyFixedCostNok;
    if (cumulative >= 0 && breakEvenMonth === null) {
      breakEvenMonth = item.month;
    }
  }

  const roi12mBasePercent = round(((sumBaseNok - totalCost12mNok) / totalCost12mNok) * 100);

  return {
    monthly,
    sumBaseNok,
    sumBestNok,
    sumWorstNok,
    totalCost12mNok,
    breakEvenMonth,
    roi12mBasePercent,
  };
}

export function calculateIdeaProfitability(idea: ProductIdea, trend: Trend): IdeaProfitabilityOverview {
  const financials = calculateIdeaFinancials(idea);
  const centerMonthlyNok = (idea.revenueLowNok + idea.revenueHighNok) / 2;

  const incomePotential = incomePotentialFromRevenue(centerMonthlyNok);
  const costLevel = costLevelFromAnnualCost(financials.totalCost12mNok);
  const competitionLevel = competitionLevelFromTrend(trend);
  const breakEvenEstimate = financials.breakEvenMonth ? `${financials.breakEvenMonth} mnd` : "> 12 mnd";
  const marketSize = marketSizeByCategory[trend.category] ?? "Europa";

  const weightedScore =
    scoreForIncomePotential(incomePotential) * 0.3 +
    scoreForCostLevel(costLevel) * 0.2 +
    scoreForBreakEven(financials.breakEvenMonth) * 0.2 +
    scoreForCompetition(competitionLevel) * 0.15 +
    trend.trendScore * 0.15;

  return {
    incomePotential,
    costLevel,
    breakEvenEstimate,
    marketSize,
    competitionLevel,
    priorityScore: round(clampScore(weightedScore)),
  };
}

export function buildTrendReport(trends: Trend[]): TrendReportEntry[] {
  return trends.map((trend) => ({
    trend,
    ideas: getProductIdeasForTrend(trend).sort(
      (a, b) => calculateIdeaProfitability(b, trend).priorityScore - calculateIdeaProfitability(a, trend).priorityScore
    ),
  }));
}

export function generateTrendReportPdf(entries: TrendReportEntry[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let y = 52;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 44) {
      doc.addPage();
      doc.setFillColor(10, 18, 33);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = 52;
    }
  };

  doc.setFillColor(10, 18, 33);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setTextColor(232, 240, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MoodMarket trendrapport", margin, y);
  y += 24;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(164, 184, 207);
  doc.text(
    "Konkrete produktforslag med malgruppe, verdiforslag, betalingsmodell, lanseringsfart og prioriteringsscore.",
    margin,
    y,
    { maxWidth: contentWidth }
  );
  y += 34;

  entries.forEach((entry, index) => {
    const cardHeight = 140 + entry.ideas.length * 52;
    ensureSpace(cardHeight + 16);
    doc.setDrawColor(50, 70, 95);
    doc.setFillColor(18, 28, 46);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 12, 12, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(240, 248, 255);
    doc.text(`${index + 1}. ${entry.trend.name}`, margin + 18, y + 24);
    doc.setFontSize(10);
    doc.setTextColor(132, 220, 244);
    doc.text(`${entry.trend.category} · ${entry.trend.country} · Score ${entry.trend.trendScore}`, margin + 18, y + 42);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(210, 220, 235);
    doc.text(doc.splitTextToSize(entry.trend.description, contentWidth - 36), margin + 18, y + 62);
    doc.setTextColor(162, 184, 207);
    doc.text(doc.splitTextToSize(`Mulighet: ${entry.trend.opportunity}`, contentWidth - 36), margin + 18, y + 94);

    let localY = y + 122;
    entry.ideas.forEach((idea) => {
      const revenue = `${formatToNok(idea.revenueLowNok)} - ${formatToNok(idea.revenueHighNok)} / maned`;
      const financials = calculateIdeaFinancials(idea);
      const overview = calculateIdeaProfitability(idea, entry.trend);
      doc.setTextColor(240, 248, 255);
      doc.text(`${idea.format}: ${idea.title}`, margin + 18, localY);
      doc.setTextColor(120, 220, 170);
      doc.text(`Prioritet ${overview.priorityScore}/100`, margin + contentWidth - 122, localY);

      localY += 13;
      doc.setTextColor(182, 202, 224);
      doc.text(
        `Konsept: ${idea.description}`,
        margin + 18,
        localY,
        { maxWidth: contentWidth - 36 }
      );
      localY += 12;
      doc.text(
        `Verdiforslag: ${idea.valueProposition} | Målgruppe: ${idea.targetAudience}`,
        margin + 18,
        localY,
        { maxWidth: contentWidth - 36 }
      );
      localY += 12;
      doc.text(
        `Betaling: ${idea.pricingModel} | Lansering: ${idea.launchTimeline} | Inntektspotensial: ${overview.incomePotential}`,
        margin + 18,
        localY,
        { maxWidth: contentWidth - 36 }
      );
      localY += 12;
      doc.text(
        `Inntekt: ${revenue} | Kostnadsnivå: ${overview.costLevel} | Break-even: ${overview.breakEvenEstimate} | Marked: ${overview.marketSize} | Konkurranse: ${overview.competitionLevel} | 12m base: ${formatToNok(financials.sumBaseNok)}`,
        margin + 18,
        localY,
        { maxWidth: contentWidth - 36 }
      );
      localY += 15;
    });

    y += cardHeight + 16;
  });

  doc.save("moodmarket-trendrapport.pdf");
}

export function formatRevenueRange(low: number, high: number) {
  return `${formatToNok(low)} - ${formatToNok(high)} / maned`;
}

export function formatNok(value: number) {
  return formatToNok(value);
}
