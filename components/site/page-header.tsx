import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-paper pb-4 pt-8 sm:pb-8 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-xs text-muted">
            <li>
              <Link
                href="/"
                className="transition-colors duration-150 hover:text-ink"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="text-ink">
              {title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base leading-7 text-muted">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
