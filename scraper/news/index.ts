export async function scrapeNewsSignals() {
  return {
    source: "news",
    enabled: false,
    message: "Mockmodus aktiv. Ingen ekstern API-tilkobling.",
    items: [],
  };
}
