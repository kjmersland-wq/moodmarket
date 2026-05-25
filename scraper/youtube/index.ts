export async function scrapeYouTubeSignals() {
  return {
    source: "youtube",
    enabled: false,
    message: "Mockmodus aktiv. Ingen ekstern API-tilkobling.",
    items: [],
  };
}
