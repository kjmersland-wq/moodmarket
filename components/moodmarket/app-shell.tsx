import Link from "next/link";
import { ChartLine, Compass, Globe, LifeBuoy, FileText } from "lucide-react";
import { LogoutButton } from "@/components/moodmarket/logout-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: ChartLine },
  { href: "/utforsk", label: "Utforsk", icon: Compass },
  { href: "/verdenskart", label: "Verdenskart", icon: Globe },
  { href: "/funksjoner", label: "Funksjoner", icon: LifeBuoy },
  { href: "/rapporter", label: "Rapporter", icon: FileText },
];

type AppShellProps = {
  currentPath: string;
  children: React.ReactNode;
};

export function AppShell({ currentPath, children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-[#070a12] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(6,182,212,0.14),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.1),transparent_35%),linear-gradient(135deg,#070a12_0%,#090f1f_45%,#070a12_100%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 md:px-8">
        <header className="sticky top-4 z-20 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">MoodMarket</p>
              <h1 className="text-xl font-semibold text-white">Global trendintelligens</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <nav className="flex flex-wrap items-center gap-2">
              {links.map(({ href, label, icon: Icon }) => {
                const active = currentPath === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all",
                      active
                        ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-zinc-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
              </nav>
              <LogoutButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
