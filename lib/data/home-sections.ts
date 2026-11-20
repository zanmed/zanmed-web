export type HomeSectionSource =
  | { type: "featured" }
  | { type: "newest" }
  | { type: "collection"; slug: string }
  | { type: "category"; slug: string };

export type HomeSectionConfig = {
  key: string;
  title: string;
  eyebrow?: string;
  source: HomeSectionSource;
  limit?: number;
};

export const DEFAULT_SECTION_LIMIT = 10;

export const HOME_SECTIONS: HomeSectionConfig[] = [
  {
    key: "deals-of-the-week",
    title: "Deals of the Week",
    eyebrow: "Special Offers",
    source: { type: "collection", slug: "deals-of-the-week" },
    limit: 10,
  },
  {
    key: "operating-theatre",
    title: "Operating Theatre",
    eyebrow: "Surgical Suites",
    source: { type: "category", slug: "operating-theatre" },
    limit: 10,
  },
  {
    key: "lab-consumables",
    title: "Lab Consumables & Reagents",
    eyebrow: "Daily Testing Supplies",
    source: { type: "category", slug: "lab-consumables-reagents" },
    limit: 10,
  },
  {
    key: "medical-equipment",
    title: "Medical Equipment",
    eyebrow: "Diagnostic & Clinical",
    source: { type: "category", slug: "medical-equipment" },
    limit: 10,
  },
  {
    key: "diabetes-hypertension",
    title: "Diabetes & Hypertension Care",
    eyebrow: "Chronic Disease Management",
    source: { type: "collection", slug: "diabetes-hypertension-care" },
    limit: 10,
  },
  {
    key: "home-care-essentials",
    title: "Home Care Essentials",
    eyebrow: "Family Health & First Aid",
    source: { type: "collection", slug: "home-care-essentials" },
    limit: 10,
  },
  {
    key: "laboratory-equipment",
    title: "Laboratory Equipment",
    eyebrow: "Pathology & Analysis",
    source: { type: "category", slug: "laboratory-equipment" },
    limit: 10,
  },

  {
    key: "hospital-furniture",
    title: "Hospital Furniture",
    eyebrow: "Wards & Consultation Rooms",
    source: { type: "category", slug: "hospital-furniture" },
    limit: 10,
  },

  {
    key: "home-care",
    title: "Home Care",
    eyebrow: "At-Home Monitoring & Support",
    source: { type: "category", slug: "home-care" },
    limit: 10,
  },
  {
    key: "mobility-aids",
    title: "Mobility Aids",
    eyebrow: "Patient Support & Rehabilitation",
    source: { type: "category", slug: "mobility-aids" },
    limit: 10,
  },
  {
    key: "ppe-hygiene",
    title: "PPE & Hygiene",
    eyebrow: "Infection Prevention",
    source: { type: "category", slug: "ppe-hygiene" },
    limit: 10,
  },

  {
    key: "dental-equipment",
    title: "Dental Equipment",
    eyebrow: "Oral Healthcare",
    source: { type: "category", slug: "dental-equipment" },
    limit: 10,
  },
  {
    key: "clinic-setup",
    title: "Clinic Setup",
    eyebrow: "Turnkey Practice Solutions",
    source: { type: "collection", slug: "clinic-setup" },
    limit: 10,
  },
  {
    key: "bedridden-patient-care",
    title: "Bedridden Patient Care",
    eyebrow: "Long-term Nursing Essentials",
    source: { type: "collection", slug: "bedridden-patient-care" },
    limit: 10,
  },
];
