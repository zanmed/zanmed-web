import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin access for Zanmed.",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="section">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
