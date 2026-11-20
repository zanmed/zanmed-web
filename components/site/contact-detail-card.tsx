import type { LucideIcon } from "lucide-react";

interface ContactDetailCardProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

export function ContactDetailCard({
  icon: Icon,
  label,
  children,
}: ContactDetailCardProps) {
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/50">
      <Icon size={18} className="text-primary" />
      <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-xs leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
