export interface YouTubeSignal {
  kilde: "youtube";
  kanal: string;
  emne: string;
  vekst: number;
}

export async function fetchYouTubeSignals(): Promise<YouTubeSignal[]> {
  return [
    {
      kilde: "youtube",
      kanal: "Global Trends Daily",
      emne: "Retro Gaming Wave",
      vekst: 36.2
    }
  ];
}
