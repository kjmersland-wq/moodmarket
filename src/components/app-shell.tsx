"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Globe2, Users, FileText } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";

const menu = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/explore", label: "Utforsk", icon: Compass },
  { href: "/verdenskart", label: "Verdenskart", icon: Globe2 },
  { href: "/rapporter", label: "Rapporter", icon: FileText },
  { href: "/konto", label: "Kontoer", icon: Users }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-4 pb-16 pt-6 sm:px-8">
      <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">MoodMarket</p>
          <h1 className="text-2xl font-semibold text-white">Globale trender, tidlig</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition",
                  isActive
                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <LogoutButton />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
