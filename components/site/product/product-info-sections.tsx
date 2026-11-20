import { FAQ_ITEMS } from "@/lib/constants";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  FileText,
  HelpCircle,
  MessageSquareText,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductInfoSectionsProps {
  description: string;
  specs: { id: string; label: string; value: string }[];
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof FileText;
  title: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
      <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon size={13} />
      </span>
      <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
        {title}
      </h2>
    </div>
  );
}

export function ProductInfoSections({
  description,
  specs,
}: ProductInfoSectionsProps) {
  const descriptionHtml = sanitizeHtml(description);

  return (
    <section className="grid gap-4 lg:grid-cols-3 font-sans">
      <div className="rounded-md border border-border bg-card p-4 shadow-xs">
        <SectionHeader icon={FileText} title="Equipment Description & Specs" />

        <div
          className="text-[11px] leading-relaxed text-muted-foreground [&_a]:underline [&_img]:my-2 [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-4"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />

        {specs.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-foreground">
              Technical Specifications
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {specs.map((spec) => (
                <span
                  key={spec.id}
                  className="rounded-md border border-border bg-soft px-2 py-1 text-[10px] leading-snug"
                >
                  <span className="text-muted-foreground">{spec.label}: </span>
                  <span className="font-semibold text-foreground">
                    {spec.value}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="rounded-md border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
        <div>
          <SectionHeader
            icon={MessageSquareText}
            title="Institutional Feedback"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Zanmed supplies hospitals, diagnostic laboratories, and private
            clinics across Kenya. Individual client reviews reflect aggregate
            satisfaction ratings verified by our institutional sales desk.
          </p>
        </div>

        <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Stethoscope size={14} />
            <span>Biomedical Support Guaranteed</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
            All machinery and clinical instrumentation include installation
            support and preventative maintenance guidance from our Nairobi
            engineering team.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-4 shadow-xs">
        <SectionHeader icon={HelpCircle} title="Procurement FAQ" />

        <Accordion className="w-full space-y-1">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.q}
              value={`faq-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-2">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[11px] leading-relaxed text-muted-foreground pb-2">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
