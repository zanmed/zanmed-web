import Link from "next/link";
import { SectionLabel } from "@/components/site/shared";
import { SITE } from "@/lib/constants";

export interface LegalSection {
  number: string;
  title: string;
  body: string[];
}

export function LegalPage({
  eyebrow,
  heading,
  intro,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-background px-4 py-8 text-foreground font-sans sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>{eyebrow}</SectionLabel>

        <h1 className="max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {heading}
        </h1>

        <p className="mt-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Last updated {lastUpdated}
        </p>

        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {intro}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
          <nav aria-label="Sections on this page" className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              <ul className="space-y-1.5 border-l border-border pl-3 text-xs">
                {sections.map((section) => (
                  <li key={section.number}>
                    <Link
                      href={`#section-${section.number}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-block pt-1 text-xs font-semibold text-primary hover:underline"
              >
                Have a question? Contact us &rarr;
              </Link>
            </div>
          </nav>

          <div className="max-w-2xl space-y-8">
            {sections.map((section) => (
              <section
                key={section.number}
                id={`section-${section.number}`}
                className="scroll-mt-24 rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50"
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-sm font-bold text-primary">
                    {section.number}.
                  </span>
                  <h2 className="text-sm font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-4 text-[11px] text-muted-foreground">
          {SITE.name} · {SITE.address}
        </p>
      </div>
    </main>
  );
}
