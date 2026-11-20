import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, staff } from "@/lib/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [adminClient({ ac, roles: { admin, staff } })],
});
