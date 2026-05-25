import { SignalBatch } from "@/lib/signal-types";

export async function scrapePodcastSignals(): Promise<SignalBatch> {
  return {
    source: "podcasts",
    enabled: false,
    message: "Mockmodus aktiv. Kilde klar for nisjesamtaler, ekspertintervjuer og lange formatspor.",
    items: [
      {
        id: "podcast-family-budget-ai",
        topic: "Family Budget AI",
        category: "Okonomi privat",
        region: "Nord-Amerika",
        countries: ["Canada", "USA"],
        momentum: 74,
        competition: 36,
        summary: "Personlig okonomi er tilbake i ekspertpodcaster med tydelig fokus pa AI-assistert budsjettering.",
        keywords: ["family finance", "budgeting", "AI planning"],
      },
    ],
  };
}
