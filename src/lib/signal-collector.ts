import { fetchForumSignals } from "../../scraper/forums";
import { fetchNewsSignals } from "../../scraper/news";
import { fetchRedditSignals } from "../../scraper/reddit";
import { fetchYouTubeSignals } from "../../scraper/youtube";

export async function collectGlobalSignals() {
  const [reddit, youtube, news, forums] = await Promise.all([
    fetchRedditSignals(),
    fetchYouTubeSignals(),
    fetchNewsSignals(),
    fetchForumSignals()
  ]);

  return {
    reddit,
    youtube,
    news,
    forums,
    hentet: new Date().toISOString()
  };
}
