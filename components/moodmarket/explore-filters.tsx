"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type ExploreFiltersProps = {
  query: string;
  region: string;
  category: string;
  regions: string[];
  categories: string[];
  onQueryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export function ExploreFilters({
  query,
  region,
  category,
  regions,
  categories,
  onQueryChange,
  onRegionChange,
  onCategoryChange,
}: ExploreFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-3">
      <label className="relative block md:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Sok etter globale trender"
          className="pl-9"
        />
      </label>
      <Select value={region} onChange={onRegionChange} options={regions} />
      <Select value={category} onChange={onCategoryChange} options={categories} />
    </div>
  );
}
