import { ReactNode } from "react";

type SectionBlockProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function SectionBlock({ icon, title, subtitle, children }: SectionBlockProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-50">
            <span className="text-cyan-200">{icon}</span>
            {title}
          </h2>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}
