export interface NewsSignal {
  kilde: "news";
  tittel: string;
  publisert: string;
  region: string;
}

export async function fetchNewsSignals(): Promise<NewsSignal[]> {
  return [
    {
      kilde: "news",
      tittel: "Functional Mushroom Soda går viralt i Canada",
      publisert: new Date().toISOString(),
      region: "Nord-Amerika"
    }
  ];
}
