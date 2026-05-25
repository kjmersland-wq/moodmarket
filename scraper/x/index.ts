import { SignalBatch } from "@/lib/signal-types";

export async function scrapeXSignals(): Promise<SignalBatch> {
  return {
    source: "x",
    enabled: false,
    message: "Mockmodus aktiv. Kilde klar for sanntidsdiskusjoner, finans og nyhetspulser.",
    items: [
      {
        id: "x-cashflow",
        topic: "Cashflow Command Centers",
        category: "Okonomi bedrift",
        region: "Europa",
        countries: ["Tyskland", "Storbritannia"],
        momentum: 88,
        competition: 57,
        summary: "CFO-miljoer og B2B-grunnere diskuterer likviditet, effektivitet og kostnadskontroll i hoy frekvens.",
        keywords: ["cashflow", "CFO dashboard", "SMB finance"],
      },
    ],
  };
}
