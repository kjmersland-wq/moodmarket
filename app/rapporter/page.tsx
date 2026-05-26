import { AppShell } from "@/components/moodmarket/app-shell";
import { ReportBuilder } from "@/components/moodmarket/report-builder";

export default function RapporterPage() {
  return (
    <AppShell currentPath="/rapporter">
      <section className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Rapporter</p>
          <h2 className="text-3xl font-semibold text-zinc-50 md:text-4xl">Bygg profesjonelle trendrapporter</h2>
          <p className="max-w-3xl text-sm text-zinc-300 md:text-base">
            Velg trendspor og generer en PDF med konkrete app- og webforslag, verdiforslag, betalingsmodell, lanseringsfart og lønnsomhetsprioritering.
          </p>
        </header>
        <ReportBuilder />
      </section>
    </AppShell>
  );
}
