import { requirePageAccess } from "@/lib/access";

import { ExploreClient } from "./explore-client";

export default async function ExplorePage() {
  await requirePageAccess();
  return <ExploreClient />;
}
