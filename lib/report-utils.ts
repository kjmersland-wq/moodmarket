import { jsPDF } from "jspdf";
import { Trend } from "@/lib/types";

export type ProductFormat = "App" | "Nettside" | "Webapp";

export type ProductIdea = {
  id: string;
  title: string;
  format: ProductFormat;
  targetAudience: string;
  pricingModel: string;
  description: string;
  revenueLowNok: number;
  revenueHighNok: number;
  monthlyFixedCostNok: number;
  setupCostNok: number;
  confidence: "Lav" | "Moderat" | "Hoy";
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
  Array<Omit<ProductIdea, "id" | "revenueLowNok" | "revenueHighNok" | "monthlyFixedCostNok" | "setupCostNok" | "confidence">>
> = {
  default: [
    {
      title: "Signalradar",
      format: "Webapp",
      targetAudience: "Profesjonelle brukere og mindre team",
      pricingModel: "Abonnement per maned",
      description: "Et arbeidsverktøy som gir oversikt, benchmarking og tidlige varsler i nisjen.",
    },
    {
      title: "Nisjeportal",
      format: "Nettside",
      targetAudience: "Soketrafikk og innholdsbrukere",
      pricingModel: "Annonser, affiliates og lead-salg",
      description: "En innholds- og sammenligningsside som eier sok, guider og anbefalinger i en tidlig kategori.",
    },
    {
      title: "Mobil assistent",
      format: "App",
      targetAudience: "Forbrukere og entusiaster",
      pricingModel: "Freemium og premium-medlemskap",
      description: "En enkel app som hjelper brukeren med handling, oppfolging eller anbefalinger rundt trenden.",
    },
  ],
  "Okonomi privat": [
    {
      title: "Hverdagsokonomi Coach",
      format: "App",
      targetAudience: "Privatpersoner og familier",
      pricingModel: "Freemium + premium-abonnement",
      description: "Gir budsjetter, spareforslag, abonnementsstopp og ukentlig handlingsliste for bedre privatokonomi.",
    },
    {
      title: "Finansguide Portal",
      format: "Nettside",
      targetAudience: "Soketrafikk og lead-generering",
      pricingModel: "Affiliate, leads og sponsorater",
      description: "Sammenligner produkter, forklarer valg og eier organiske sok rundt kostnadsreduksjon og smarte pengestrategier.",
    },
    {
      title: "Okonomioversikt Pro",
      format: "Webapp",
      targetAudience: "Raadgivere og medlemsmiljoer",
      pricingModel: "Abonnement per bruker eller white-label",
      description: "Samler husholdningsdata i dashboard med scenarioplanlegging og mal for bedre kundeoppfolging.",
    },
  ],
  "Okonomi bedrift": [
    {
      title: "Likviditetsradar SMB",
      format: "Webapp",
      targetAudience: "SMB-ledere og CFO-funksjoner",
      pricingModel: "B2B SaaS-abonnement",
      description: "Visualiserer kontantstrom, risiko og neste 90 dagers scenarier i et enkelt kontrollrom.",
    },
    {
      title: "Finansinnsikt Hub",
      format: "Nettside",
      targetAudience: "B2B lead-generering",
      pricingModel: "Lead-salg og rapportabonnement",
      description: "Publiserer bransjeinnsikt og skaffer kvalifiserte leads til finans- og regnskapstjenester.",
    },
    {
      title: "Varslingsapp for kostnadslekkasje",
      format: "App",
      targetAudience: "Eiervledede bedrifter",
      pricingModel: "Abonnement per selskap",
      description: "Varsler om avvik, fakturamønstre og kontantpress i et raskt mobilformat for ledelsen.",
    },
  ],
  Ferie: [
    {
      title: "Reiseplanlegger Nisje",
      format: "App",
      targetAudience: "Reisende og turister",
      pricingModel: "Freemium + partnerprovisjon",
      description: "Setter sammen itineraries, lokale anbefalinger og sesongbaserte valg for nye reisetrender.",
    },
    {
      title: "Destinasjonsportal",
      format: "Nettside",
      targetAudience: "Sok og innholdsmarkeder",
      pricingModel: "Affiliate og sponsorplassering",
      description: "Bygger autoritet i en tidlig reisevertikal med guider, sammenligninger og bookingtrafikk.",
    },
    {
      title: "B2B Retreat Planner",
      format: "Webapp",
      targetAudience: "Bedrifter og arrangorer",
      pricingModel: "Prosjektavgift + abonnement",
      description: "Hjelper team med a planlegge retreat, logistikk og leverandorvalg i ett verktoy.",
    },
  ],
  Hobby: [
    {
      title: "Enthusiast Community App",
      format: "App",
      targetAudience: "Entusiaster og medlemsmiljoer",
      pricingModel: "Medlemskap og premium-funksjoner",
      description: "Knytter hobbybrukere sammen med logging, innhold, kjøp og community-funksjoner.",
    },
    {
      title: "Nisjeinnhold Side",
      format: "Nettside",
      targetAudience: "Sok og affiliate-marked",
      pricingModel: "Affiliate, annonser og kurs",
      description: "Bygger organisk trafikk gjennom guider, anmeldelser og beste praksis rundt hobbysegmentet.",
    },
    {
      title: "Workshop Manager",
      format: "Webapp",
      targetAudience: "Kursleverandorer og butikker",
      pricingModel: "Abonnement og billettavgift",
      description: "Drifter kurs, events, medlemskap og salg i hobby- og makersegmenter.",
    },
  ],
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

export function getProductIdeasForTrend(trend: Trend): ProductIdea[] {
  const templates = categoryTemplates[trend.category] ?? categoryTemplates.default;
  const base = estimateBaseMonthlyRevenue(trend);
  const multipliers = [0.82, 1, 1.22];
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

export function buildTrendReport(trends: Trend[]): TrendReportEntry[] {
  return trends.map((trend) => ({
    trend,
    ideas: getProductIdeasForTrend(trend),
  }));
}

export function generateTrendReportPdf(entries: TrendReportEntry[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let y = 52;

  const ensureSpace = (needed: number) => {
    if (y + needed > 780) {
      doc.addPage();
      y = 52;
    }
  };

  doc.setFillColor(10, 18, 33);
  doc.rect(0, 0, pageWidth, 842, "F");
  doc.setTextColor(232, 240, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MoodMarket trendrapport", margin, y);
  y += 24;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(164, 184, 207);
  doc.text(
    "Scenario-basert rapport med trendstyrke, produktforslag og realistiske inntektsintervaller. Estimatene er ikke garantier.",
    margin,
    y,
    { maxWidth: contentWidth }
  );
  y += 34;

  entries.forEach((entry, index) => {
    ensureSpace(250);
    doc.setDrawColor(50, 70, 95);
    doc.setFillColor(18, 28, 46);
    doc.roundedRect(margin, y, contentWidth, 210, 12, 12, "FD");
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
      doc.setTextColor(240, 248, 255);
      doc.text(`${idea.format}: ${idea.title}`, margin + 18, localY);
      doc.setTextColor(120, 220, 170);
      doc.text(revenue, margin + 220, localY);

      localY += 13;
      doc.setTextColor(182, 202, 224);
      doc.text(
        `12m base: ${formatToNok(financials.sumBaseNok)} | best: ${formatToNok(financials.sumBestNok)} | worst: ${formatToNok(financials.sumWorstNok)}`,
        margin + 18,
        localY
      );
      localY += 12;
      doc.text(
        `Kostnader 12m: ${formatToNok(financials.totalCost12mNok)} | Break-even: ${financials.breakEvenMonth ? `Mnd ${financials.breakEvenMonth}` : "Etter 12m"} | ROI(base): ${financials.roi12mBasePercent}%`,
        margin + 18,
        localY
      );
      localY += 14;
    });

    y += 228;
  });

  doc.save("moodmarket-trendrapport.pdf");
}

export function formatRevenueRange(low: number, high: number) {
  return `${formatToNok(low)} - ${formatToNok(high)} / maned`;
}

export function formatNok(value: number) {
  return formatToNok(value);
}
