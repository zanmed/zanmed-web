"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

const desktopBase =
  "flex h-8 items-center rounded-md border px-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const desktopIdle =
  "border-transparent text-foreground hover:border-border hover:bg-[var(--soft)] hover:text-primary";
const desktopActive =
  "border-primary bg-[var(--soft)] font-semibold text-primary";

const mobileBase =
  "flex items-center rounded-md border px-3 py-2.5 text-sm transition-colors duration-150";
const mobileIdle =
  "border-transparent text-foreground hover:border-border hover:bg-[var(--soft)] hover:text-primary";
const mobileActive =
  "border-primary bg-[var(--soft)] font-semibold text-primary";

export function ActiveNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
              desktopBase,
              isActive ? desktopActive : desktopIdle,
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function StaticNavLinks() {
  return (
    <>
      {NAV_LINKS.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={[desktopBase, desktopIdle].join(" ")}
        >
          {label}
        </Link>
      ))}
    </>
  );
}

export function ActiveMobileNavLinks({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={[mobileBase, isActive ? mobileActive : mobileIdle].join(
              " ",
            )}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function StaticMobileNavLinks({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  return (
    <>
      {NAV_LINKS.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          onClick={onNavigate}
          className={[mobileBase, mobileIdle].join(" ")}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
