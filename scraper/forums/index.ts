export async function scrapeForumSignals() {
  return {
    source: "forums",
    enabled: false,
    message: "Mockmodus aktiv. Ingen ekstern API-tilkobling.",
    items: [],
  };
}
