"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { NAV_ITEMS, type NavItem, type DashboardRole } from "./nav-config";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  role?: DashboardRole | null;
}

const DEFAULT_ROLES: DashboardRole[] = ["admin", "staff"];

export function AdminSidebar({ open, onClose, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  function isVisible(item: NavItem) {
    const allowedRoles = item.roles ?? DEFAULT_ROLES;
    return role ? allowedRoles.includes(role) : false;
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-20 bg-foreground/50 transition-opacity duration-300 ease-in-out lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="font-serif text-4xl text-primary font-extrabold">
              Z
            </span>
            <span className="text-xs tracking-[.28em]">
              Zanmed Medical
              <small className="mt-1 block text-[7px] tracking-[.18em] text-primary">
                ADMIN STUDIO
              </small>
            </span>
          </Link>
          <button
            className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-8 grid gap-2 text-sm">
          {NAV_ITEMS.filter(isVisible).map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const visibleChildren = item.children.filter(isVisible);
              if (visibleChildren.length === 0) return null;

              const groupActive = visibleChildren.some((child) =>
                isActive(child.href),
              );
              const isOpen = openGroup === item.label || groupActive;

              return (
                <div key={item.label} className="grid gap-1">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    className={`flex w-full items-center justify-between gap-3 px-2 py-1.5 transition ${
                      groupActive
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} />
                      {item.label}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-6 grid gap-1 border-l border-sidebar-border pl-3">
                      {visibleChildren.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-2 py-1.5 transition ${
                              isActive(child.href)
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                            }`}
                          >
                            <ChildIcon size={14} />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Handle standard single links
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={`flex items-center gap-3 px-2 py-1.5 transition ${
                  isActive(item.href!)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
