import { SignalBatch } from "@/lib/signal-types";

export async function scrapeNewsletterSignals(): Promise<SignalBatch> {
  return {
    source: "newsletters",
    enabled: false,
    message: "Mockmodus aktiv. Kilde klar for curator-drevne nisjebrev og ekspertsignaler.",
    items: [
      {
        id: "newsletter-solar-home",
        topic: "Solar Home Bundles",
        category: "Okonomi privat",
        region: "Europa",
        countries: ["Spania", "Italia"],
        momentum: 70,
        competition: 48,
        summary: "Energi- og boligbrev peker mot raskt voksende interesse for kombinerte hjemmeenergiløsninger.",
        keywords: ["solar", "home battery", "energy savings"],
      },
    ],
  };
}
