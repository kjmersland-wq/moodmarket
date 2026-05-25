import { SignalBatch } from "@/lib/signal-types";

export async function scrapeGitHubSignals(): Promise<SignalBatch> {
  return {
    source: "github",
    enabled: false,
    message: "Mockmodus aktiv. Kilde klar for open source-prosjekter, repo-stjerner og utvikleradopsjon.",
    items: [
      {
        id: "github-ai-music-agents",
        topic: "AI Music Agents",
        category: "Teknologi",
        region: "Nord-Amerika",
        countries: ["USA", "Canada"],
        momentum: 91,
        competition: 62,
        summary: "Utvikleraktivitet og nye verktøy rundt lydagenter indikerer tidlig teknologisk modning.",
        keywords: ["audio agents", "music ai", "generative audio"],
      },
    ],
  };
}
