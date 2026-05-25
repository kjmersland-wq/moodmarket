import { cn } from "@/lib/utils";

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
};

export function Select({ value, onChange, options, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-11 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
        className
      )}
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-zinc-900 text-zinc-100">
          {option}
        </option>
      ))}
    </select>
  );
}
