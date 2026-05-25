import { AppShell } from "@/components/moodmarket/app-shell";
import { Badge } from "@/components/ui/badge";
import { getSignalOverview } from "@/scraper";

const featureCards = [
  {
    title: "Dashboard og prioritering",
    text: "Fem hovedseksjoner viser hvilke trendspor som vokser raskest, er tidlige, er mest overvaket og hva som nettopp har begynt a ta fart.",
  },
  {
    title: "Utforsk med globale filtre",
    text: "Sok pa tvers av regioner og kategorier som okonomi, ferie, hobby, helse, mote og teknologi for a finne segmenter med tydelig momentum.",
  },
  {
    title: "Verdenskart med flerutvalg",
    text: "Velg ett eller flere land samtidig og sammenlign hvilke markeder som viser liknende signaler eller helt ulike muligheter.",
  },
  {
    title: "Trenddetaljer og muligheter",
    text: "Hver trend viser vekst, kilder, AI-oppsummering, mulighetsrom og bruksomrader for privatpersoner og virksomheter.",
  },
  {
    title: "Privat innlogging",
    text: "Løsningen er låst til din epost og støtter registrering og innlogging, slik at prosjektet kan brukes privat uten a være apent for alle.",
  },
  {
    title: "Rapporter og PDF",
    text: "Du kan velge trendspor og generere profesjonelle PDF-rapporter med forslag til apper, nettsider og webapper samt realistiske inntektsintervaller.",
  },
];

const workflows = [
  "Start i Dashboard for a se hvilke signaler som allerede har sterkest momentum.",
  "Bruk Utforsk for a finne nisjer innen et bestemt marked eller en bestemt kategori.",
  "Ga til Verdenskart for a sammenligne land og regioner som viser felles drivere.",
  "Apne trenddetaljer for a vurdere kilder, mulighetsrom og use cases.",
  "Bruk Rapporter for a bygge beslutningsgrunnlag og PDF-underlag for neste produktgrep.",
];

export default async function FunksjonerPage() {
  const overview = await getSignalOverview();

  return (
    <AppShell currentPath="/funksjoner">
      <section className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Funksjoner</p>
          <h2 className="text-3xl font-semibold text-zinc-50 md:text-4xl">Alt som er bygget inn na</h2>
          <p className="max-w-3xl text-sm text-zinc-300 md:text-base">
            Denne siden gir oversikt over hva MoodMarket allerede kan brukes til, og hvordan du far mest mulig verdi ut av trendovervakingen i praksis.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Signalkilder</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{overview.sourceCount}</p>
            <p className="mt-2 text-sm text-zinc-300">Kildegrupper klargjort for trendfangst pa tvers av innhold, diskusjon, kode og markedsplasser.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Mock-signaler</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{overview.totalSignals}</p>
            <p className="mt-2 text-sm text-zinc-300">Tidlige signalsaker strukturert for videre utvidelse og scoring nar ekte kilder kobles til.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Aktive kilder</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{overview.activeSources}</p>
            <p className="mt-2 text-sm text-zinc-300">Forelopig brukes mockmodus, men strukturen er klar for gradvis overgang til sanntidssignaler.</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-lg font-semibold text-zinc-50">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{card.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Full utnyttelse</p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Anbefalt arbeidsflyt</h3>
            <ol className="mt-4 space-y-3 text-sm text-zinc-300">
              {workflows.map((step, index) => (
                <li key={step} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <span className="mr-2 text-cyan-200">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Kildebredde</p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Hva du fanger opp</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {overview.batches.map((batch) => (
                <Badge key={batch.source}>{batch.source}</Badge>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              Ved a kombinere samtalekilder, video, nyheter, open source og markedsplasser far du et bredere bilde av hva som faktisk beveger seg tidlig i markedet.
            </p>
          </article>
        </section>
      </section>
    </AppShell>
  );
}
