import { requirePageAccess } from "@/lib/access";

import { KontoClient } from "./konto-client";

export default async function KontoPage() {
  await requirePageAccess({ requireAdmin: true });
  return <KontoClient />;
}