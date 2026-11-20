"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import type { DashboardRole } from "./nav-config";

const VALID_ROLES: readonly DashboardRole[] = ["admin", "staff", "writer"];

function toDashboardRole(role?: string | null): DashboardRole | null {
  if (!role) return null;
  return (VALID_ROLES as readonly string[]).includes(role)
    ? (role as DashboardRole)
    : null;
}

interface AdminShellProps {
  children: React.ReactNode;
  userName?: string | null;
  role?: string;
}

function getGreeting(name?: string | null) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return name ? `Good ${timeOfDay}, ${name}.` : `Good ${timeOfDay}.`;
}

export function AdminShell({ children, userName, role }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const dateLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        role={toDashboardRole(role)}
      />
      <div className="lg:pl-64">
        <AdminHeader
          onMenuOpen={() => setMenuOpen(true)}
          greeting={getGreeting(userName)}
          dateLabel={dateLabel}
        />
        <main className="mx-auto max-w-7xl p-2 lg:p-5">{children}</main>
      </div>
    </div>
  );
}
