import { AppShell } from "@/components/app-shell";
import { WorldMapPanel } from "@/components/world-map-panel";
import { requirePageAccess } from "@/lib/access";

export default async function VerdenskartPage() {
  await requirePageAccess();

  return (
    <AppShell>
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-semibold text-white">Verdenskart</h2>
        <p className="text-slate-300">Varme områder, voksende trender og klikkbare land (MVP med mockdata)</p>
      </div>
      <WorldMapPanel />
    </AppShell>
  );
}
