export const PRODUCT_CONDITIONS = ["NEW", "REFURBISHED", "USED"] as const;
export type ProductConditionValue = (typeof PRODUCT_CONDITIONS)[number];

export const PRODUCT_CONDITION_LABELS: Record<ProductConditionValue, string> = {
  NEW: "New",
  REFURBISHED: "Refurbished",
  USED: "Used",
};
