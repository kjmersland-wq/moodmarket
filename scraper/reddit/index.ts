export interface RedditSignal {
  kilde: "reddit";
  tittel: string;
  score: number;
  url: string;
}

export async function fetchRedditSignals(): Promise<RedditSignal[]> {
  return [
    {
      kilde: "reddit",
      tittel: "AI Music Copilot",
      score: 89,
      url: "https://reddit.com"
    }
  ];
}
