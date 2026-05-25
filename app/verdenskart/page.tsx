import { AppShell } from "@/components/moodmarket/app-shell";
import { WorldMap } from "@/components/moodmarket/world-map";

export default function VerdenskartPage() {
  return (
    <AppShell currentPath="/verdenskart">
      <section className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Verdenskart</p>
          <h2 className="text-3xl font-semibold text-zinc-50 md:text-4xl">Interaktiv varmevisning av globale signaler</h2>
          <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
            Klikk pa landene for a se hvilke trender som vokser raskest i hvert marked.
          </p>
        </header>
        <WorldMap />
      </section>
    </AppShell>
  );
}
