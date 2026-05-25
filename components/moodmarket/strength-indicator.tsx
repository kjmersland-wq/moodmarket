import { cn, strengthLabel } from "@/lib/utils";

type StrengthIndicatorProps = {
  value: number;
};

export function StrengthIndicator({ value }: StrengthIndicatorProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <span>Styrke</span>
        <span>{strengthLabel(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className={cn(
            "h-2 rounded-full",
            value >= 85
              ? "bg-emerald-400"
              : value >= 70
                ? "bg-cyan-400"
                : value >= 55
                  ? "bg-amber-400"
                  : "bg-zinc-400"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
