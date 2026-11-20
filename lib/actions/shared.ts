import type { ActionState } from "@/lib/utils";

export const NO_PERMISSION: ActionState = {
  status: "error",
  message: "You don't have permission to do this.",
};

export const SLUG_TAKEN: ActionState = {
  status: "error",
  message: "That slug is already in use.",
  fieldErrors: { slug: "This slug is already taken." },
};

export function hasErrorCode(err: unknown, code: string) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === code
  );
}
