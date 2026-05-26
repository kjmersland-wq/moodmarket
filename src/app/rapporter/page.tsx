import { AppShell } from "@/components/app-shell";
import { requirePageAccess } from "@/lib/access";
import { fetchAllTrends } from "@/lib/trend-repository";

import { RapporterClient } from "./rapporter-client";

export default async function RapporterPage() {
  await requirePageAccess();
  const trends = await fetchAllTrends({ limit: 6 });

  return (
    <AppShell>
      <RapporterClient trends={trends} />
    </AppShell>
  );
}