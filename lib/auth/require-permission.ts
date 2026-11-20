import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { statement } from "@/lib/auth/permissions";
import { UnauthorizedError, ForbiddenError } from "@/lib/auth/errors";

export type PermissionMap = {
  [K in keyof typeof statement]?: (typeof statement)[K][number][];
};

const KNOWN_ROLES = ["admin", "staff", "writer"] as const;
type KnownRole = (typeof KNOWN_ROLES)[number];

function isKnownRole(role: string | undefined): role is KnownRole {
  return !!role && (KNOWN_ROLES as readonly string[]).includes(role);
}

export async function requirePermission(permissions: PermissionMap) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.banned) {
    throw new UnauthorizedError();
  }

  const role = (session.user as { role?: string }).role;
  if (!isKnownRole(role)) {
    throw new ForbiddenError();
  }

  const result = await auth.api.userHasPermission({
    body: { role, permissions },
  });

  if (!result.success) {
    throw new ForbiddenError();
  }

  return session;
}
