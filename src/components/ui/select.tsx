import * as React from "react";

import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.ComponentProps<"select"> {
  options: Option[];
}

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40 focus:bg-white/10",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
          {option.label}
        </option>
      ))}
    </select>
  );
}
