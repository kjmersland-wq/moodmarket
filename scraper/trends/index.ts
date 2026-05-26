import { fetchForumSignals } from "../forums";
import { fetchNewsSignals } from "../news";
import { fetchRedditSignals } from "../reddit";
import { fetchYouTubeSignals } from "../youtube";

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
