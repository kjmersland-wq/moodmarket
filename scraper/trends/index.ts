export async function scrapeTrendSignals() {
  return {
    source: "trends",
    enabled: false,
    message: "Mockmodus aktiv. Ingen ekstern API-tilkobling.",
    items: [],
  };
}
