import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,

  blog: ["create", "read", "update", "delete"],
  product: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  collection: ["create", "read", "update", "delete"],
  heroSlide: ["create", "read", "update", "delete"],
  whatsAppOrder: ["read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  blog: ["create", "read", "update", "delete"],
  product: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  collection: ["create", "read", "update", "delete"],
  heroSlide: ["create", "read", "update", "delete"],
  whatsAppOrder: ["read", "update", "delete"],
});

export const staff = ac.newRole({
  blog: ["create", "read", "update"],
  product: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  collection: ["create", "read", "update", "delete"],
  heroSlide: ["create", "read", "update", "delete"],
  whatsAppOrder: ["read", "update", "delete"],
});

export const writer = ac.newRole({
  blog: ["create", "read", "update"],
});
