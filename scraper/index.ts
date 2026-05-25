import { scrapeForumSignals } from "@/scraper/forums";
import { scrapeGitHubSignals } from "@/scraper/github";
import { scrapeMarketplaceSignals } from "@/scraper/marketplaces";
import { scrapeNewsSignals } from "@/scraper/news";
import { scrapeNewsletterSignals } from "@/scraper/newsletters";
import { scrapePodcastSignals } from "@/scraper/podcasts";
import { scrapeRedditSignals } from "@/scraper/reddit";
import { scrapeTikTokSignals } from "@/scraper/tiktok";
import { scrapeTrendSignals } from "@/scraper/trends";
import { scrapeXSignals } from "@/scraper/x";
import { scrapeYouTubeSignals } from "@/scraper/youtube";

export async function collectAllSignals() {
  return Promise.all([
    scrapeRedditSignals(),
    scrapeYouTubeSignals(),
    scrapeNewsSignals(),
    scrapeForumSignals(),
    scrapeTrendSignals(),
    scrapeTikTokSignals(),
    scrapeXSignals(),
    scrapePodcastSignals(),
    scrapeNewsletterSignals(),
    scrapeGitHubSignals(),
    scrapeMarketplaceSignals(),
  ]);
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
