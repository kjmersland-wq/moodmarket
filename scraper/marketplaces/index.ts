import { SignalBatch } from "@/lib/signal-types";

export async function scrapeMarketplaceSignals(): Promise<SignalBatch> {
  return {
    source: "marketplaces",
    enabled: false,
    message: "Mockmodus aktiv. Kilde klar for produktvolum, prisendringer og ettersporsel i markedsplasser.",
    items: [
      {
        id: "market-retro-handhelds",
        topic: "Retro Gaming Handhelds",
        category: "Hobby",
        region: "Asia",
        countries: ["Japan"],
        momentum: 79,
        competition: 58,
        summary: "Produktlistingvolum og tilbehor peker mot fortsatt vekst i nisjehardware og samlersegmentet.",
        keywords: ["retro handheld", "collector devices", "gaming accessories"],
      },
    ],
  };
}
