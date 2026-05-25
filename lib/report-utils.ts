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
  confidence: "Lav" | "Moderat" | "Hoy";
};

export type TrendReportEntry = {
  trend: Trend;
  ideas: ProductIdea[];
};

const categoryTemplates: Record<string, Array<Omit<ProductIdea, "id" | "revenueLowNok" | "revenueHighNok" | "confidence">>> = {
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

function estimateBaseMonthlyRevenue(trend: Trend) {
  const momentum = trend.trendScore * 0.7 + trend.strength * 0.35 + trend.growth24h * 0.9 + trend.growth7d * 0.18;
  return Math.round(15000 + momentum * 420);
}

function confidenceFromTrend(trend: Trend): ProductIdea["confidence"] {
  if (trend.trendScore >= 88 && trend.strength >= 80) return "Hoy";
  if (trend.trendScore >= 76) return "Moderat";
  return "Lav";
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

    return {
      id: `${trend.id}-${index}`,
      ...template,
      revenueLowNok,
      revenueHighNok,
      confidence,
    };
  });
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
    ensureSpace(210);
    doc.setDrawColor(50, 70, 95);
    doc.setFillColor(18, 28, 46);
    doc.roundedRect(margin, y, contentWidth, 150, 12, 12, "FD");
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
      doc.setTextColor(240, 248, 255);
      doc.text(`${idea.format}: ${idea.title}`, margin + 18, localY);
      doc.setTextColor(120, 220, 170);
      doc.text(revenue, margin + 220, localY);
      localY += 14;
    });

    y += 168;
  });

  doc.save("moodmarket-trendrapport.pdf");
}

export function formatRevenueRange(low: number, high: number) {
  return `${formatToNok(low)} - ${formatToNok(high)} / maned`;
}
