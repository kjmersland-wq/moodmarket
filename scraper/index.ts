import { fetchForumSignals } from "@/scraper/forums";
import { scrapeGitHubSignals } from "@/scraper/github";
import { scrapeMarketplaceSignals } from "@/scraper/marketplaces";
import { fetchNewsSignals } from "@/scraper/news";
import { scrapeNewsletterSignals } from "@/scraper/newsletters";
import { scrapePodcastSignals } from "@/scraper/podcasts";
import { fetchRedditSignals } from "@/scraper/reddit";
import { scrapeTikTokSignals } from "@/scraper/tiktok";
import { collectGlobalSignals } from "@/scraper/trends";
import { scrapeXSignals } from "@/scraper/x";
import { fetchYouTubeSignals } from "@/scraper/youtube";

function normalizeBatch(source: "reddit" | "youtube" | "news" | "forums", items: unknown[]) {
  return {
    source,
    enabled: true,
    message: "Mock-signaler klare",
    items: items.map((item, index) => ({
      id: `${source}-${index + 1}`,
      topic: JSON.stringify(item),
      category: "Teknologi" as const,
      region: "Global" as const,
      countries: ["Global"],
      momentum: 50,
      competition: 35,
      summary: "Mock-signal",
      keywords: [source]
    }))
  };
}

export async function collectAllSignals() {
  const [reddit, youtube, news, forums, trends, tiktok, x, podcasts, newsletters, github, marketplaces] =
    await Promise.all([
      fetchRedditSignals(),
      fetchYouTubeSignals(),
      fetchNewsSignals(),
      fetchForumSignals(),
      collectGlobalSignals(),
      scrapeTikTokSignals(),
      scrapeXSignals(),
      scrapePodcastSignals(),
      scrapeNewsletterSignals(),
      scrapeGitHubSignals(),
      scrapeMarketplaceSignals()
    ]);

  return [
    normalizeBatch("reddit", reddit),
    normalizeBatch("youtube", youtube),
    normalizeBatch("news", news),
    normalizeBatch("forums", forums),
    {
      source: "trends" as const,
      enabled: true,
      message: "Globale signaler samlet",
      items: []
    },
    tiktok,
    x,
    podcasts,
    newsletters,
    github,
    marketplaces
  ];
}

export async function getSignalOverview() {
  const batches = await collectAllSignals();

  const totalSignals = batches.reduce((sum, batch) => sum + batch.items.length, 0);
  const activeSources = batches.filter((batch) => batch.enabled).length;

  return {
    batches,
    totalSignals,
    activeSources,
    sourceCount: batches.length,
  };
}
