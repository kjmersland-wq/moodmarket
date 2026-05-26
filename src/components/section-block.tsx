import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionBlockProps {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
}

export function SectionBlock({ title, subtitle, icon, children }: SectionBlockProps) {
  return (
    <section className="space-y-5">
      <CardHeader className="mb-0 px-0">
        <div>
          <CardTitle className="text-2xl">
            <span className="mr-2">{icon}</span>
            {title}
          </CardTitle>
          <CardDescription className="mt-1 text-base">{subtitle}</CardDescription>
        </div>
      </CardHeader>
      {children}
    </section>
  );
}
