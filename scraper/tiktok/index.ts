import { SignalBatch } from "@/lib/signal-types";

export async function scrapeTikTokSignals(): Promise<SignalBatch> {
  return {
    source: "tiktok",
    enabled: false,
    message: "Mockmodus aktiv. Kilde klar for korte video- og creator-signaler.",
    items: [
      {
        id: "tiktok-coolcation",
        topic: "Coolcation Planning",
        category: "Ferie",
        region: "Europa",
        countries: ["Island", "Portugal"],
        momentum: 82,
        competition: 41,
        summary: "Korte reisevideoer og guideformater peker mot svalere destinasjoner og skuldersesong.",
        keywords: ["coolcation", "slow travel", "nordic travel"],
      },
    ],
  };
}
