export interface ForumSignal {
  kilde: "forums";
  tema: string;
  omtaler: number;
}

export async function fetchForumSignals(): Promise<ForumSignal[]> {
  return [
    {
      kilde: "forums",
      tema: "Afrofusion Style Labs",
      omtaler: 412
    }
  ];
}
