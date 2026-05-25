import { Flame, Globe2, Radar, Sparkles, Star } from "lucide-react";
import { AppShell } from "@/components/moodmarket/app-shell";
import { SectionBlock } from "@/components/moodmarket/section-block";
import { TrendCard } from "@/components/moodmarket/trend-card";
import { WorldMap } from "@/components/moodmarket/world-map";
import { dashboardSections, getTrendsForSection } from "@/lib/trend-service";

const icons = {
  trendraketter: <Flame className="h-5 w-5" />,
  "tidlige-signaler": <Radar className="h-5 w-5" />,
  verdensoversikt: <Globe2 className="h-5 w-5" />,
  "mest-overvaket": <Star className="h-5 w-5" />,
  "nye-signaler": <Sparkles className="h-5 w-5" />,
};

export default function Home() {
  return (
    <AppShell currentPath="/">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Dashboard</p>
        <h2 className="max-w-3xl text-3xl font-semibold text-zinc-50 md:text-5xl">
          Oppdag globale trender for de blir mainstream
        </h2>
        <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
          MoodMarket analyserer tidlige signaler fra hele verden og gir deg trendene med hoyest vekst,
          lav konkurranse og sterkest momentum.
        </p>
      </section>

      <div className="space-y-7">
        {dashboardSections.map((section) => {
          const trends = getTrendsForSection(section.key);
          return (
            <SectionBlock
              key={section.key}
              icon={icons[section.key]}
              title={section.title}
              subtitle={section.subtitle}
            >
              {section.key === "verdensoversikt" ? (
                <div className="space-y-5">
                  <WorldMap />
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {trends.map((trend, index) => (
                      <TrendCard key={trend.id} trend={trend} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {trends.map((trend, index) => (
                    <TrendCard key={trend.id} trend={trend} index={index} />
                  ))}
                </div>
              )}
            </SectionBlock>
          );
        })}
      </div>
    </AppShell>
  );
}
