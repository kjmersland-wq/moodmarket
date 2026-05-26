import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/40 focus:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
