import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function strengthLabel(strength: number) {
  if (strength >= 85) return "Ekstrem";
  if (strength >= 70) return "Sterk";
  if (strength >= 55) return "Moderat";
  return "Tidlig";
}
