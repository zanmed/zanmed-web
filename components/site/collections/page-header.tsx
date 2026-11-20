import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  parent,
  children,
}: {
  title: string;
  description?: string;
  parent?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-paper pb-4 pt-6 sm:pb-8 sm:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
            <li>
              <Link
                href="/"
                className="transition-colors duration-150 hover:text-bronze-dark"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={12} />
            </li>
            {parent && (
              <>
                <li>
                  <Link
                    href={parent.href}
                    className="transition-colors duration-150 hover:text-bronze-dark"
                  >
                    {parent.label}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={12} />
                </li>
              </>
            )}
            <li aria-current="page" className="text-bronze-dark">
              {title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 text-2xl font-semibold text-bronze-dark tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
