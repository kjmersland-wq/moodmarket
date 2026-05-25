export async function scrapeRedditSignals() {
  return {
    source: "reddit",
    enabled: false,
    message: "Mockmodus aktiv. Ingen ekstern API-tilkobling.",
    items: [],
  };
}
