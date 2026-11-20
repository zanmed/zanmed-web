/**
 * prisma/seed-admins.ts — creates or promotes an admin user only
 * ---------------------------------------------------------------------------
 * Run with:  pnpm seed:admins
 *
 *   ADMIN_EMAIL      required
 *   ADMIN_PASSWORD   required (min 12 characters, matching your auth config)
 *   ADMIN_NAME       optional, defaults to "Admin"
 *
 * - New user: created with the better-auth admin plugin's server-side
 *   auth.api.createUser, which works even though public sign-up is disabled.
 *   better-auth hashes the password and creates the credential account.
 * - Existing user: promoted to admin and un-banned. Password is untouched.
 * - Never touches products, categories, blogs, carts or orders.
 *
 * PowerShell example:
 *   $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="a-strong-password"; pnpm seed:admins
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 12; // keep in sync with emailAndPassword.minPasswordLength

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error(`"${email}" is not a valid email address.`);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "admin",
        banned: false,
        banReason: null,
        banExpires: null,
      },
    });
    console.log(
      `✓ Existing user promoted to admin: ${email} (password unchanged)`,
    );
    return;
  }

  const { user } = await auth.api.createUser({
    body: { email, password, name, role: "admin" },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
  console.log(`✓ Admin created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
