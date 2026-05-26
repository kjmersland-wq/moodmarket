import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function toCompact(value: number) {
  return new Intl.NumberFormat("nb-NO", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}
