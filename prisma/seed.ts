/**
 * prisma/seed.ts — single entry point for `pnpm seed` (tsx prisma/seed.ts)
 * ---------------------------------------------------------------------------
 * SAFE BY DEFAULT: a plain `pnpm seed` never deletes anything and never
 * overwrites existing rows. It only creates taxonomy, products, blog posts and
 * hero slides that don't exist yet (matched on slug; hero slides only when the
 * table is empty).
 *
 *   pnpm seed                         add new data only
 *   UPDATE_EXISTING=true pnpm seed    also overwrite existing products and blog
 *                                     posts (name, short description,
 *                                     description, price, image, condition,
 *                                     SEO fields, relations, specs)
 *                                     — never touches inStock, featured or
 *                                     stockCount
 *   SEED_SAMPLE_ORDERS=true pnpm seed also create 20 fake guest carts and 20
 *                                     fake WhatsApp orders/quotes (only if those
 *                                     tables are empty). Dev/test DBs only.
 *   RESET_CATALOG=true pnpm seed      wipe the catalog first (see below)
 *
 * RESET_CATALOG wipes Products (and their specs), Categories, Collections,
 * Blogs, Carts and WhatsAppOrders. It is refused if any WhatsApp orders exist
 * unless FORCE_RESET=yes is also set. Untouched: User, Session, Account,
 * Verification, HeroSlide.
 *
 * TO ADD THE NEXT BATCH: append objects to the array returned by
 * `productSeeds()` below. Every product needs a `shortDescription`.
 *
 * NOTES ON THE DATA
 * - Products, prices, discounts and stock counts are modelled on the live
 *   ZanMed catalogue. The dental kit and nitrile gloves are made-up samples so
 *   those categories aren't empty. Customers, carts and orders are fictional.
 * - Image paths are placeholders (/images/seed/<slug>.webp): swap them for
 *   ImageKit paths.
 * - price: null means "Contact for price" (quote-only product).
 */

import { ProductCondition } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const DAY = 86_400_000;
const img = (slug: string) => `/images/seed/${slug}.webp`;

async function resetCatalog() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "whatsapp_order", "cart", "product", "category", "collection", "blog" CASCADE`,
  );
  console.log(
    "✓ Reset complete — deleted Products, Categories, Collections, Blogs, Carts and WhatsAppOrders.",
  );
  console.log("  Untouched: User, Session, Account, Verification, HeroSlide.");
}

// ─── Categories (2 levels) ───────────────────────────────────────────────

interface CategorySeed {
  slug: string;
  name: string;
  subtitle: string;
  children?: { slug: string; name: string }[];
}

async function seedCategories() {
  const categories: CategorySeed[] = [
    {
      slug: "laboratory-equipment",
      name: "Laboratory Equipment",
      subtitle: "Microscopes, centrifuges, sterilizers and mixers",
      children: [
        { slug: "microscopes", name: "Microscopes" },
        { slug: "centrifuges", name: "Centrifuges" },
        { slug: "autoclaves", name: "Autoclaves & Sterilizers" },
        { slug: "mixers-pipettes", name: "Mixers & Pipettes" },
      ],
    },
    {
      slug: "lab-consumables-reagents",
      name: "Lab Consumables & Reagents",
      subtitle: "Rapid test kits and laboratory reagents",
      children: [
        { slug: "rapid-test-kits", name: "Rapid Test Kits" },
        { slug: "lab-reagents", name: "Lab Reagents" },
      ],
    },
    {
      slug: "medical-equipment",
      name: "Medical Equipment",
      subtitle: "Monitoring and diagnostic equipment",
      children: [{ slug: "patient-monitors", name: "Patient Monitors" }],
    },
    {
      slug: "home-care",
      name: "Home Care",
      subtitle: "Home monitoring and daily care essentials",
      children: [
        { slug: "blood-pressure-monitors", name: "Blood Pressure Monitors" },
        { slug: "glucometers", name: "Glucometers" },
        { slug: "pulse-oximeters", name: "Pulse Oximeters" },
        { slug: "weighing-scales", name: "Weighing Scales" },
      ],
    },
    {
      slug: "hospital-furniture",
      name: "Hospital Furniture",
      subtitle: "Beds and patient comfort",
      children: [
        { slug: "hospital-beds", name: "Hospital Beds" },
        { slug: "pressure-mattresses", name: "Pressure Mattresses" },
      ],
    },
    {
      slug: "mobility-aids",
      name: "Mobility Aids",
      subtitle: "Wheelchairs and walking support",
      children: [{ slug: "wheelchairs", name: "Wheelchairs" }],
    },
    {
      slug: "mortuary-equipment",
      name: "Mortuary Equipment",
      subtitle: "Mortuary freezers and fittings",
    },
    {
      slug: "operating-theatre",
      name: "Operating Theatre",
      subtitle: "Emergency and theatre equipment",
    },
    {
      slug: "dental-equipment",
      name: "Dental Equipment",
      subtitle: "Dental kits and supplies",
    },
    {
      slug: "ppe-hygiene",
      name: "PPE & Hygiene",
      subtitle: "Gloves, masks and disinfectants",
    },
  ];

  const bySlug = new Map<string, { id: string }>();
  for (const [i, c] of categories.entries()) {
    const parentData = {
      name: c.name,
      subtitle: c.subtitle,
      image: img(c.slug),
      order: i,
      active: true,
    };
    const parent = await prisma.category.upsert({
      where: { slug: c.slug },
      update: parentData,
      create: { slug: c.slug, ...parentData },
    });
    bySlug.set(c.slug, parent);

    for (const [j, child] of (c.children ?? []).entries()) {
      const childData = {
        name: child.name,
        image: img(child.slug),
        order: j,
        active: true,
        parentId: parent.id,
      };
      const created = await prisma.category.upsert({
        where: { slug: child.slug },
        update: childData,
        create: { slug: child.slug, ...childData },
      });
      bySlug.set(child.slug, created);
    }
  }
  console.log(`✓ Categories (${bySlug.size})`);
  return bySlug;
}

// ─── Collections ─────────────────────────────────────────────────────────

async function seedCollections() {
  const collections = [
    {
      slug: "laboratory-starter-kits",
      name: "Laboratory Starter Kits",
      description:
        "Core equipment and reagents for setting up a small laboratory.",
    },
    {
      slug: "home-care-essentials",
      name: "Home Care Essentials",
      description: "Monitoring devices for caring for a patient at home.",
    },
    {
      slug: "bedridden-patient-care",
      name: "Bedridden Patient Care",
      description: "Bed, mattress and monitoring for long-term bed care.",
    },
    {
      slug: "rapid-test-bundle",
      name: "Rapid Test Bundle",
      description: "Commonly requested rapid diagnostic test kits.",
    },
    {
      slug: "mobility-support",
      name: "Mobility Support",
      description: "Wheelchairs for children and adults.",
    },
    {
      slug: "clinic-setup",
      name: "Clinic Setup",
      description: "Key equipment for equipping a new clinic.",
    },
    {
      slug: "diabetes-hypertension-care",
      name: "Diabetes & Hypertension Care",
      description: "Glucose and blood pressure monitoring.",
    },
    {
      slug: "deals-of-the-week",
      name: "Deals of the Week",
      description: "Discounted products this week.",
    },
  ];

  const bySlug = new Map<string, { id: string }>();
  for (const [i, c] of collections.entries()) {
    const data = {
      name: c.name,
      description: c.description,
      coverImage: img(c.slug),
      order: i,
      active: true,
    };
    const collection = await prisma.collection.upsert({
      where: { slug: c.slug },
      update: data,
      create: { slug: c.slug, ...data },
    });
    bySlug.set(c.slug, collection);
  }
  console.log(`✓ Collections (${bySlug.size})`);
  return bySlug;
}

// ─── Products ────────────────────────────────────────────────────────────

interface ProductSeed {
  slug: string;
  name: string;
  shortDescription: string; // one-line summary shown on cards and listings
  description: string;
  price: number | null; // null = contact for price
  compareAtPrice?: number;
  stockCount?: number;
  featured?: boolean;
  condition: ProductCondition;
  categorySlug: string; // leaf category
  collectionSlugs: string[];
  specs: { label: string; value: string }[];
}

function productSeeds(): ProductSeed[] {
  return [
    // ===================== BATCH 1 (25 products) =====================
    {
      slug: "patient-monitor-5-parameters",
      name: "Patient Monitor 5-Parameters",
      shortDescription:
        "Bedside monitor tracking ECG, NIBP, SpO₂, pulse and respiration for ICUs, theatres and emergency rooms.",
      description:
        "Multi-parameter patient monitor for ECG, NIBP, SpO₂, pulse rate and respiratory rate. Suited to ICUs, theatres, emergency rooms and patient transport.",
      price: 59000,
      compareAtPrice: 65000,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "patient-monitors",
      collectionSlugs: ["clinic-setup", "deals-of-the-week"],
      specs: [
        {
          label: "Parameters",
          value: "ECG, NIBP, SpO₂, pulse rate, respiration rate",
        },
        { label: "Use", value: "ICU, theatre, emergency, patient transport" },
      ],
    },
    {
      slug: "salmonella-typhi-paratyphi-ag-test-kit",
      name: "Salmonella Typhi/Paratyphi Ag Test Kit",
      shortDescription:
        "Rapid stool antigen test that detects active typhoid and paratyphoid infection in 10 minutes.",
      description:
        "Rapid stool antigen test for detecting active Salmonella Typhi and Paratyphi infections, with results in 10 minutes.",
      price: 2500,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "rapid-test-kits",
      collectionSlugs: ["rapid-test-bundle"],
      specs: [
        { label: "Test type", value: "Rapid stool antigen" },
        { label: "Result time", value: "10 minutes" },
        { label: "Detects", value: "S. Typhi and S. Paratyphi" },
      ],
    },
    {
      slug: "h-pylori-antibody-rapid-test-kit",
      name: "H. pylori Antibody Rapid Test Kit",
      shortDescription:
        "Dipstick test for H. pylori antibodies in serum or plasma, with results in 10–15 minutes.",
      description:
        "Rapid dipstick test for antibodies against Helicobacter pylori in serum or plasma, with results in 10–15 minutes.",
      price: 2300,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "rapid-test-kits",
      collectionSlugs: ["rapid-test-bundle"],
      specs: [
        { label: "Test type", value: "Rapid dipstick (antibody)" },
        { label: "Sample", value: "Serum or plasma" },
        { label: "Result time", value: "10–15 minutes" },
      ],
    },
    {
      slug: "hcg-pregnancy-urine-rapid-test-kit",
      name: "Hcg Pregnancy Urine Rapid Test Kit",
      shortDescription:
        "Quick urine test for early detection of pregnancy through the hCG hormone.",
      description:
        "Rapid urine test for early detection of pregnancy hormone hCG.",
      price: 400,
      compareAtPrice: 450,
      condition: ProductCondition.NEW,
      categorySlug: "rapid-test-kits",
      collectionSlugs: ["rapid-test-bundle"],
      specs: [
        { label: "Test type", value: "Rapid urine test" },
        { label: "Sample", value: "Urine" },
      ],
    },
    {
      slug: "yuwell-blood-pressure-monitor",
      name: "Yuwell Blood Pressure Monitor",
      shortDescription:
        "Easy-to-use digital blood pressure monitor for daily checks at home.",
      description:
        "Digital blood pressure monitor for convenient home monitoring.",
      price: 3700,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "blood-pressure-monitors",
      collectionSlugs: ["home-care-essentials", "diabetes-hypertension-care"],
      specs: [
        { label: "Type", value: "Digital blood pressure monitor" },
        { label: "Use", value: "Home monitoring" },
      ],
    },
    {
      slug: "omron-m1-basic-blood-pressure-monitor",
      name: "OMRON M1 Basic Blood Pressure Monitor",
      shortDescription:
        "Trusted Omron digital monitor for accurate blood pressure readings at home.",
      description:
        "Omron M1 Basic digital blood pressure monitor for accurate readings at home.",
      price: 4500,
      stockCount: 19,
      condition: ProductCondition.NEW,
      categorySlug: "blood-pressure-monitors",
      collectionSlugs: ["bedridden-patient-care", "diabetes-hypertension-care"],
      specs: [
        { label: "Make", value: "Omron" },
        { label: "Model", value: "M1 Basic" },
        { label: "Use", value: "Home monitoring" },
      ],
    },
    {
      slug: "micropipette-toppette-pipettor",
      name: "Micropipette – TopPette Pipettor",
      shortDescription:
        "Adjustable-volume pipettor for accurate liquid handling in clinical and teaching labs.",
      description:
        "Adjustable-volume pipettor for accurate liquid handling in clinical and teaching laboratories.",
      price: 3500,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "mixers-pipettes",
      collectionSlugs: ["laboratory-starter-kits"],
      specs: [
        { label: "Type", value: "Adjustable pipettor" },
        { label: "Model", value: "TopPette" },
      ],
    },
    {
      slug: "olympus-cx23-microscope",
      name: "Olympus CX23 Microscope",
      shortDescription:
        "Reliable Olympus microscope for clinical, educational and research laboratories.",
      description:
        "Olympus CX23 microscope for clinical, educational and research laboratories.",
      price: 215000,
      compareAtPrice: 230000,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "microscopes",
      collectionSlugs: ["deals-of-the-week"],
      specs: [
        { label: "Make", value: "Olympus" },
        { label: "Model", value: "CX23" },
        { label: "Use", value: "Clinical and educational laboratories" },
      ],
    },
    {
      slug: "xsz-107-microscope",
      name: "XSZ-107 Microscope",
      shortDescription:
        "Affordable microscope for teaching and routine laboratory work.",
      description:
        "Affordable laboratory microscope for teaching and routine lab work.",
      price: 26000,
      stockCount: 20,
      condition: ProductCondition.NEW,
      categorySlug: "microscopes",
      collectionSlugs: ["laboratory-starter-kits"],
      specs: [
        { label: "Model", value: "XSZ-107" },
        { label: "Use", value: "Teaching and routine lab work" },
      ],
    },
    {
      slug: "centrifuge-6-tubes-square",
      name: "Centrifuge 6-Tubes Square",
      shortDescription:
        "Compact 6-tube centrifuge for separating blood and other lab samples.",
      description:
        "Compact 6-tube laboratory centrifuge for separating blood and other samples.",
      price: 8500,
      compareAtPrice: 9000,
      condition: ProductCondition.NEW,
      categorySlug: "centrifuges",
      collectionSlugs: ["laboratory-starter-kits", "deals-of-the-week"],
      specs: [
        { label: "Capacity", value: "6 tubes" },
        { label: "Shape", value: "Square" },
      ],
    },
    {
      slug: "laboratory-rotator-mixer",
      name: "Laboratory Rotator Mixer",
      shortDescription:
        "Gentle, consistent mixing of blood samples and reagents.",
      description:
        "Rotator mixer for gentle, consistent mixing of blood samples and reagents.",
      price: 19000,
      condition: ProductCondition.NEW,
      categorySlug: "mixers-pipettes",
      collectionSlugs: ["laboratory-starter-kits"],
      specs: [
        { label: "Type", value: "Laboratory rotator" },
        { label: "Use", value: "Blood sample and reagent mixing" },
      ],
    },
    {
      slug: "autoclave-machine-18-litres",
      name: "Autoclave Machine 18 Litres",
      shortDescription:
        "18-litre steam sterilizer for clinics, dental practices and small laboratories.",
      description:
        "18-litre steam sterilizer for clinics, dental practices and small laboratories.",
      price: 22000,
      stockCount: 20,
      condition: ProductCondition.NEW,
      categorySlug: "autoclaves",
      collectionSlugs: ["laboratory-starter-kits", "clinic-setup"],
      specs: [
        { label: "Capacity", value: "18 litres" },
        { label: "Type", value: "Steam sterilizer" },
      ],
    },
    {
      slug: "digital-vertical-autoclave-50l-kenya",
      name: "Digital Vertical Autoclave 50L Kenya",
      shortDescription:
        "Large 50-litre digital autoclave for hospitals and busy laboratories.",
      description:
        "50-litre digital vertical autoclave for hospitals and larger laboratories.",
      price: 205000,
      stockCount: 20,
      condition: ProductCondition.NEW,
      categorySlug: "autoclaves",
      collectionSlugs: [],
      specs: [
        { label: "Capacity", value: "50 litres" },
        { label: "Control", value: "Digital" },
        { label: "Design", value: "Vertical" },
      ],
    },
    {
      slug: "2-crank-manual-hospital-bed-with-mattress",
      name: "2 Crank Manual Hospital Bed With Mattress",
      shortDescription:
        "Adjustable two-crank hospital bed with mattress for wards and home care.",
      description:
        "Two-crank manual hospital bed supplied with a mattress, for wards and home care.",
      price: 29500,
      stockCount: 20,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "hospital-beds",
      collectionSlugs: ["bedridden-patient-care", "clinic-setup"],
      specs: [
        { label: "Cranks", value: "2" },
        { label: "Operation", value: "Manual" },
        { label: "Includes", value: "Mattress" },
      ],
    },
    {
      slug: "inflatable-ripple-mattress",
      name: "Inflatable Ripple Mattress",
      shortDescription:
        "Alternating-pressure mattress that helps prevent bed sores in bedridden patients.",
      description:
        "Inflatable ripple mattress to help prevent pressure sores in bedridden patients.",
      price: 4499,
      compareAtPrice: 5000,
      condition: ProductCondition.NEW,
      categorySlug: "pressure-mattresses",
      collectionSlugs: ["bedridden-patient-care", "deals-of-the-week"],
      specs: [
        { label: "Type", value: "Inflatable ripple mattress" },
        { label: "Use", value: "Pressure sore prevention" },
      ],
    },
    {
      slug: "standard-pediatric-wheelchair",
      name: "Standard Pediatric Wheelchair",
      shortDescription: "Manual wheelchair sized for children.",
      description: "Manual wheelchair sized for children.",
      price: 14500,
      compareAtPrice: 16000,
      stockCount: 5,
      condition: ProductCondition.NEW,
      categorySlug: "wheelchairs",
      collectionSlugs: ["mobility-support", "deals-of-the-week"],
      specs: [
        { label: "Size", value: "Pediatric" },
        { label: "Operation", value: "Manual" },
      ],
    },
    {
      slug: "foldable-electric-wheelchair",
      name: "Foldable Electric Wheelchair",
      shortDescription:
        "Powered wheelchair that folds flat for easy storage and transport.",
      description:
        "Foldable electric wheelchair for easy storage and transport.",
      price: 123000,
      compareAtPrice: 125000,
      stockCount: 5,
      condition: ProductCondition.NEW,
      categorySlug: "wheelchairs",
      collectionSlugs: ["mobility-support"],
      specs: [
        { label: "Operation", value: "Electric" },
        { label: "Design", value: "Foldable" },
      ],
    },
    {
      slug: "2-bodies-stainless-steel-mortuary-freezer",
      name: "2 Bodies Stainless Steel Mortuary Freezer",
      shortDescription:
        "Stainless steel mortuary freezer for two bodies. Contact us for a quote.",
      description:
        "Stainless steel mortuary freezer for two bodies. Contact us for a quote and delivery.",
      price: null,
      stockCount: 2,
      condition: ProductCondition.NEW,
      categorySlug: "mortuary-equipment",
      collectionSlugs: [],
      specs: [
        { label: "Capacity", value: "2 bodies" },
        { label: "Material", value: "Stainless steel" },
      ],
    },
    {
      slug: "emergency-crash-cart-procedure-trolley",
      name: "Emergency Crash Cart (Procedure Trolley)",
      shortDescription:
        "Mobile trolley for resuscitation and emergency ward procedures.",
      description:
        "Emergency crash cart and procedure trolley for resuscitation and ward procedures.",
      price: 70000,
      stockCount: 10,
      condition: ProductCondition.NEW,
      categorySlug: "operating-theatre",
      collectionSlugs: ["clinic-setup"],
      specs: [
        { label: "Type", value: "Emergency procedure trolley" },
        { label: "Use", value: "Resuscitation and emergency response" },
      ],
    },
    {
      slug: "fingertip-pulse-oximeter",
      name: "Fingertip Pulse Oximeter",
      shortDescription:
        "Clip-on oximeter for quick SpO₂ and pulse rate readings.",
      description:
        "Fingertip pulse oximeter for quick SpO₂ and pulse rate readings.",
      price: 1500,
      compareAtPrice: 1900,
      featured: true,
      condition: ProductCondition.NEW,
      categorySlug: "pulse-oximeters",
      collectionSlugs: [
        "home-care-essentials",
        "bedridden-patient-care",
        "deals-of-the-week",
      ],
      specs: [
        { label: "Type", value: "Fingertip" },
        { label: "Measures", value: "SpO₂ and pulse rate" },
      ],
    },
    {
      slug: "on-call-plus-blood-glucose-monitoring-system",
      name: "On Call Plus Blood Glucose Monitoring System",
      shortDescription:
        "Simple blood glucose meter for testing diabetes at home.",
      description: "Blood glucose meter for home diabetes testing.",
      price: 2200,
      compareAtPrice: 2500,
      condition: ProductCondition.NEW,
      categorySlug: "glucometers",
      collectionSlugs: ["home-care-essentials", "diabetes-hypertension-care"],
      specs: [
        { label: "Type", value: "Blood glucose monitoring system" },
        { label: "Use", value: "Home diabetes testing" },
      ],
    },
    {
      slug: "mechanical-weight-and-height-scale",
      name: "Mechanical Weight And Height Scale",
      shortDescription:
        "Durable mechanical scale with height rod for clinics and health facilities.",
      description:
        "Mechanical scale with height rod for clinics and health facilities.",
      price: 9800,
      compareAtPrice: 10000,
      stockCount: 20,
      condition: ProductCondition.NEW,
      categorySlug: "weighing-scales",
      collectionSlugs: ["home-care-essentials", "clinic-setup"],
      specs: [
        { label: "Type", value: "Mechanical" },
        { label: "Measures", value: "Weight and height" },
      ],
    },
    {
      slug: "blood-grouping-reagents",
      name: "Blood Grouping Reagents",
      shortDescription: "Reagents for ABO and Rh blood grouping in the lab.",
      description: "Reagents for ABO and Rh blood grouping in the laboratory.",
      price: 1500,
      condition: ProductCondition.NEW,
      categorySlug: "lab-reagents",
      collectionSlugs: ["laboratory-starter-kits"],
      specs: [
        { label: "Tests", value: "ABO and Rh grouping" },
        { label: "Use", value: "Laboratory" },
      ],
    },
    {
      slug: "dental-examination-kit-set",
      name: "Dental Examination Kit Set",
      shortDescription: "Basic dental instrument set for clinic examinations.",
      description: "Basic dental examination instrument set for clinics.",
      price: 6500,
      condition: ProductCondition.NEW,
      categorySlug: "dental-equipment",
      collectionSlugs: [],
      specs: [
        { label: "Type", value: "Dental instrument set" },
        { label: "Use", value: "Examination" },
      ],
    },
    {
      slug: "blue-nitrile-examination-gloves-100",
      name: "Blue Nitrile Examination Gloves (100 pcs)",
      shortDescription:
        "Box of 100 disposable blue nitrile gloves for examinations and general use.",
      description: "Disposable blue nitrile examination gloves, box of 100.",
      price: 650,
      condition: ProductCondition.NEW,
      categorySlug: "ppe-hygiene",
      collectionSlugs: [],
      specs: [
        { label: "Material", value: "Nitrile" },
        { label: "Pack size", value: "100 pieces" },
        { label: "Colour", value: "Blue" },
      ],
    },
  ];
}

async function seedProducts(
  categories: Map<string, { id: string }>,
  collections: Map<string, { id: string }>,
) {
  const updateExisting = process.env.UPDATE_EXISTING === "true";
  const seeds = productSeeds();
  let count = 0;
  let skipped = 0;

  for (const [i, p] of seeds.entries()) {
    const category = categories.get(p.categorySlug);
    if (!category)
      throw new Error(
        `Category "${p.categorySlug}" missing for product "${p.slug}"`,
      );
    const collectionIds = p.collectionSlugs.map((slug) => {
      const c = collections.get(slug);
      if (!c)
        throw new Error(`Collection "${slug}" missing for product "${p.slug}"`);
      return { id: c.id };
    });

    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });

    if (existing && !updateExisting) {
      skipped++;
      continue;
    }

    const data = {
      name: p.name,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      image: img(p.slug),
      condition: p.condition,
      metaTitle: `${p.name} in Kenya | Zanmed Medical Supplies`,
      metaDescription: p.shortDescription,
      categoryId: category.id,
    };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, collections: { set: collectionIds } },
      create: {
        slug: p.slug,
        ...data,
        gallery: [],
        inStock: true,
        featured: p.featured ?? false,
        stockCount: p.stockCount ?? null,
        // Stagger createdAt so "Newest" ordering is meaningful.
        createdAt: new Date(Date.now() - i * DAY),
        collections: { connect: collectionIds },
      },
    });

    await prisma.productSpec.deleteMany({ where: { productId: product.id } });
    if (p.specs.length) {
      await prisma.productSpec.createMany({
        data: p.specs.map((s, order) => ({
          productId: product.id,
          label: s.label,
          value: s.value,
          order,
        })),
      });
    }
    count++;
  }

  console.log(`✓ Products (${count} written, ${skipped} skipped)`);
}

// ─── Blog ────────────────────────────────────────────────────────────────

interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  published: string | null; // ISO date, null = draft
}

function blogSeeds(): BlogSeed[] {
  return [
    {
      slug: "laboratory-starter-kits-kenya-guide",
      title:
        "Laboratory Starter Kits in Kenya: Essential Equipment, Costs & Setup Guide (2026)",
      excerpt:
        "Planning to set up a medical laboratory in Kenya? Essential kits, equipment lists, pricing and setup tips.",
      tags: ["laboratory", "starter kits"],
      published: "2026-04-16",
    },
    {
      slug: "best-pressure-mattresses-bedridden-patients-kenya",
      title:
        "Best Pressure Mattresses for Bedridden Patients in Kenya: Types, Prices & Buying Guide (2026)",
      excerpt:
        "Prevent bed sores and improve patient comfort with the right pressure mattress for home care.",
      tags: ["home care", "mattresses"],
      published: "2026-04-15",
    },
    {
      slug: "best-wheelchairs-elderly-special-needs-kenya",
      title:
        "Best Wheelchairs for Elderly and Special Needs Patients in Kenya: Complete Buying Guide (2026)",
      excerpt:
        "Compare wheelchair types, features and prices for elderly patients and special needs.",
      tags: ["mobility", "wheelchairs"],
      published: "2026-04-15",
    },
    {
      slug: "how-to-choose-wheelchair-kenya",
      title:
        "How to Choose the Right Wheelchair in Kenya: Types, Prices & Expert Buying Guide (2026)",
      excerpt:
        "Types, pricing and features to consider when choosing a wheelchair for comfort and long-term use.",
      tags: ["mobility", "wheelchairs"],
      published: "2026-04-15",
    },
    {
      slug: "best-hospital-beds-home-use-kenya",
      title:
        "Best Hospital Beds for Home Use in Kenya: Types, Prices & Buying Guide (2026)",
      excerpt:
        "Types, features and prices to help you choose a medical bed for comfort and recovery at home.",
      tags: ["home care", "hospital beds"],
      published: "2026-04-15",
    },
    {
      slug: "home-based-care-products-kenya-guide",
      title:
        "Home-Based Care Products in Kenya: Essential Medical Supplies for Safe and Comfortable Care (2026 Guide)",
      excerpt:
        "Medical beds, mobility aids and monitoring devices for safe, effective home care.",
      tags: ["home care"],
      published: "2026-04-15",
    },
    {
      slug: "omron-blood-pressure-machines-kenya-price-guide",
      title:
        "Omron Blood Pressure Machines in Kenya: Accurate Home Monitoring, Prices & Best Models (2026 Guide)",
      excerpt:
        "Features, pricing and tips for choosing an Omron blood pressure machine for home monitoring.",
      tags: ["blood pressure", "omron"],
      published: "2026-04-15",
    },
    {
      slug: "on-call-plus-blood-sugar-monitoring-meter-strips-kenya",
      title:
        "On Call Plus Blood Sugar Monitoring Meter and Strips: Accurate, Affordable Diabetes Testing in Kenya (2026 Guide)",
      excerpt:
        "Features, benefits and tips for using the On Call Plus glucometer and test strips.",
      tags: ["diabetes", "glucometer"],
      published: "2026-04-15",
    },
    {
      slug: "autoclave-buying-guide-kenya",
      title: "Autoclave Buying Guide for Kenyan Clinics and Laboratories",
      excerpt:
        "Capacity, control type and maintenance to consider before buying a steam sterilizer.",
      tags: ["autoclave", "sterilization"],
      published: null,
    },
    {
      slug: "microscope-buying-guide-kenya",
      title: "How to Choose a Laboratory Microscope in Kenya",
      excerpt:
        "Monocular, binocular and clinical microscopes compared for schools and diagnostic labs.",
      tags: ["microscope", "laboratory"],
      published: null,
    },
  ];
}

async function seedBlogs() {
  const updateExisting = process.env.UPDATE_EXISTING === "true";
  let count = 0;
  let skipped = 0;

  for (const b of blogSeeds()) {
    const existing = await prisma.blog.findUnique({
      where: { slug: b.slug },
      select: { id: true },
    });
    if (existing && !updateExisting) {
      skipped++;
      continue;
    }

    const data = {
      title: b.title,
      excerpt: b.excerpt,
      content: `## ${b.title}\n\n${b.excerpt}\n\nReplace this placeholder with the full article.`,
      coverImage: img(`blog-${b.slug}`),
      tags: b.tags,
      status: b.published ? ("PUBLISHED" as const) : ("DRAFT" as const),
      publishedAt: b.published ? new Date(b.published) : null,
      metaTitle: b.title,
      metaDescription: b.excerpt,
    };
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: data,
      create: { slug: b.slug, ...data },
    });
    count++;
  }
  console.log(`✓ Blogs (${count} written, ${skipped} skipped)`);
}

// ─── Hero slides (only when the table is empty) ──────────────────────────

async function seedHeroSlides() {
  if ((await prisma.heroSlide.count()) > 0) {
    console.log("✓ Hero slides (skipped, table not empty)");
    return;
  }
  const slides = [
    {
      eyebrow: "Operating Theatre",
      title: "Patient Monitor 5-Parameters",
      accent: "5-Parameters",
      description:
        "ECG, NIBP, SpO₂, pulse and respiration monitoring for hospitals, ICUs and clinics.",
      image: img("patient-monitor-5-parameters"),
      href: "/products/patient-monitor-5-parameters",
      pillTop: "From KSh 59,000",
      pillBottom: "Nationwide delivery",
    },
    {
      eyebrow: "Rapid Test Kits",
      title: "Fast results in 10 minutes",
      accent: "10 minutes",
      description:
        "Typhoid, H. pylori and pregnancy rapid tests for clinics and laboratories.",
      image: img("salmonella-typhi-paratyphi-ag-test-kit"),
      href: "/products?categories=rapid-test-kits",
      pillTop: "From KSh 400",
      pillBottom: "Bulk pricing available",
    },
    {
      eyebrow: "Laboratory",
      title: "Equip your laboratory",
      accent: "laboratory",
      description:
        "Microscopes, centrifuges, autoclaves and mixers from Zanmed.",
      image: img("olympus-cx23-microscope"),
      href: "/products?categories=laboratory-equipment",
      pillTop: "Olympus microscopes",
      pillBottom: "Installation support",
    },
    {
      eyebrow: "Home Care",
      title: "Care at home, made simple",
      accent: "made simple",
      description:
        "Hospital beds, blood pressure monitors, oximeters and glucometers.",
      image: img("2-crank-manual-hospital-bed-with-mattress"),
      href: "/products?categories=home-care",
      pillTop: "Beds from KSh 29,500",
      pillBottom: "Delivery to all 47 counties",
    },
    {
      eyebrow: "Mobility Aids",
      title: "Wheelchairs for every need",
      accent: "every need",
      description: "Manual, pediatric and electric wheelchairs.",
      image: img("foldable-electric-wheelchair"),
      href: "/products?categories=wheelchairs",
      pillTop: "From KSh 14,500",
      pillBottom: "Pediatric sizes in stock",
    },
  ];
  await prisma.heroSlide.createMany({
    data: slides.map((s, order) => ({ ...s, order })),
  });
  console.log(`✓ Hero slides (${slides.length})`);
}

// ─── Sample carts and orders (opt-in: SEED_SAMPLE_ORDERS=true) ───────────

interface OrderSeed {
  name: string;
  org?: string;
  county: string;
  source:
    | "PRODUCT_PAGE"
    | "CART"
    | "QUICK_BUY"
    | "QUOTE_REQUEST"
    | "BULK_QUOTE";
  status: "CLICKED" | "CONTACTED" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
  items: [string, number][];
  note?: string;
}

function orderSeeds(): OrderSeed[] {
  return [
    {
      name: "Wanjiku Kamau",
      county: "Nairobi",
      source: "PRODUCT_PAGE",
      status: "FULFILLED",
      items: [["omron-m1-basic-blood-pressure-monitor", 1]],
    },
    {
      name: "Brian Otieno",
      county: "Kisumu",
      source: "CART",
      status: "FULFILLED",
      items: [
        ["fingertip-pulse-oximeter", 2],
        ["on-call-plus-blood-glucose-monitoring-system", 1],
      ],
    },
    {
      name: "Amina Hassan",
      county: "Mombasa",
      source: "QUICK_BUY",
      status: "CONFIRMED",
      items: [["inflatable-ripple-mattress", 1]],
    },
    {
      name: "Dr. Kevin Mutua",
      org: "Mutua Family Clinic",
      county: "Machakos",
      source: "CART",
      status: "CONFIRMED",
      items: [
        ["autoclave-machine-18-litres", 1],
        ["mechanical-weight-and-height-scale", 1],
      ],
    },
    {
      name: "Grace Njeri",
      county: "Nakuru",
      source: "PRODUCT_PAGE",
      status: "CONTACTED",
      items: [["2-crank-manual-hospital-bed-with-mattress", 1]],
    },
    {
      name: "Peter Kiprop",
      county: "Uasin Gishu",
      source: "PRODUCT_PAGE",
      status: "CLICKED",
      items: [["standard-pediatric-wheelchair", 1]],
    },
    {
      name: "Faith Wambui",
      county: "Kiambu",
      source: "QUICK_BUY",
      status: "FULFILLED",
      items: [["hcg-pregnancy-urine-rapid-test-kit", 10]],
    },
    {
      name: "Samuel Odhiambo",
      org: "Lakeview Diagnostics",
      county: "Kisumu",
      source: "CART",
      status: "FULFILLED",
      items: [
        ["salmonella-typhi-paratyphi-ag-test-kit", 5],
        ["h-pylori-antibody-rapid-test-kit", 5],
      ],
    },
    {
      name: "Lucy Achieng",
      org: "Greenfield Academy",
      county: "Nairobi",
      source: "PRODUCT_PAGE",
      status: "CONTACTED",
      items: [["xsz-107-microscope", 4]],
    },
    {
      name: "Joseph Karanja",
      county: "Nyeri",
      source: "PRODUCT_PAGE",
      status: "CANCELLED",
      items: [["foldable-electric-wheelchair", 1]],
    },
    {
      name: "Mercy Chebet",
      org: "Chebet Medical Centre",
      county: "Nandi",
      source: "CART",
      status: "CONFIRMED",
      items: [
        ["patient-monitor-5-parameters", 1],
        ["emergency-crash-cart-procedure-trolley", 1],
      ],
    },
    {
      name: "Daniel Mwangi",
      county: "Nairobi",
      source: "QUICK_BUY",
      status: "FULFILLED",
      items: [["yuwell-blood-pressure-monitor", 1]],
    },
    {
      name: "Esther Naliaka",
      county: "Kakamega",
      source: "PRODUCT_PAGE",
      status: "CLICKED",
      items: [["centrifuge-6-tubes-square", 1]],
    },
    {
      name: "Hassan Abdi",
      org: "Coastal Memorial Funeral Home",
      county: "Mombasa",
      source: "QUOTE_REQUEST",
      status: "CONTACTED",
      items: [["2-bodies-stainless-steel-mortuary-freezer", 1]],
      note: "Please send a quote including delivery to Mombasa.",
    },
    {
      name: "Dr. Alice Wekesa",
      org: "Wekesa Medical Laboratory",
      county: "Bungoma",
      source: "CART",
      status: "CONFIRMED",
      items: [
        ["micropipette-toppette-pipettor", 3],
        ["blood-grouping-reagents", 4],
        ["laboratory-rotator-mixer", 1],
      ],
    },
    {
      name: "Tabitha Muthoni",
      county: "Murang'a",
      source: "PRODUCT_PAGE",
      status: "FULFILLED",
      items: [["inflatable-ripple-mattress", 2]],
    },
    {
      name: "Ibrahim Yusuf",
      org: "Eastleigh Pharmacy",
      county: "Nairobi",
      source: "CART",
      status: "FULFILLED",
      items: [
        ["blue-nitrile-examination-gloves-100", 20],
        ["fingertip-pulse-oximeter", 10],
      ],
    },
    {
      name: "Rose Atieno",
      org: "Sunrise Medical Clinic",
      county: "Siaya",
      source: "BULK_QUOTE",
      status: "CONTACTED",
      items: [],
      note: "We are opening a new clinic and need a quote for a lab starter kit, 2 hospital beds and an autoclave.",
    },
    {
      name: "Collins Ruto",
      org: "Rift Valley County Hospital (procurement)",
      county: "Nakuru",
      source: "BULK_QUOTE",
      status: "CONTACTED",
      items: [],
      note: "LPO request: 10 patient monitors and 5 crash carts. Please share wholesale pricing and lead time.",
    },
    {
      name: "Naomi Chepkorir",
      county: "Kericho",
      source: "QUICK_BUY",
      status: "CLICKED",
      items: [["mechanical-weight-and-height-scale", 1]],
    },
  ];
}

async function seedSampleOrders() {
  const dbProducts = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, price: true },
  });
  const bySlug = new Map(dbProducts.map((p) => [p.slug, p]));

  // Carts: 20 guest carts built deterministically from priced products.
  if ((await prisma.cart.count()) === 0) {
    const priced = dbProducts.filter((p) => p.price !== null);
    for (let i = 0; i < 20; i++) {
      const a = priced[i % priced.length];
      let b = priced[(i * 7 + 3) % priced.length];
      if (b.id === a.id) b = priced[(i + 1) % priced.length];
      await prisma.cart.create({
        data: {
          sessionId: `seed-session-${String(i + 1).padStart(2, "0")}`,
          items: {
            create: [
              { productId: a.id, quantity: 1 + (i % 3) },
              { productId: b.id, quantity: 1 },
            ],
          },
        },
      });
    }
    console.log("✓ Sample carts (20)");
  } else {
    console.log("✓ Sample carts (skipped, table not empty)");
  }

  // WhatsApp orders and quote requests.
  if ((await prisma.whatsAppOrder.count()) === 0) {
    const orders = orderSeeds();
    for (const [i, o] of orders.entries()) {
      const lines = o.items.map(([slug, quantity]) => {
        const p = bySlug.get(slug);
        if (!p) throw new Error(`Product "${slug}" missing for sample order`);
        return { id: p.id, name: p.name, price: p.price, quantity };
      });
      const total = lines.reduce(
        (sum, l) => sum + (l.price ?? 0) * l.quantity,
        0,
      );
      const message =
        o.note ??
        `Hello, I want to purchase:\n\n${lines
          .map(
            (l) =>
              `*${l.name}* x${l.quantity}\n*Price:* KSh ${((l.price ?? 0) * l.quantity).toLocaleString("en-KE")}`,
          )
          .join("\n\n")}\n\nThank you!`;

      await prisma.whatsAppOrder.create({
        data: {
          customerName: o.name,
          customerPhone: `+2547000000${String(i + 1).padStart(2, "0")}`,
          organization: o.org ?? null,
          county: o.county,
          message,
          source: o.source,
          status: o.status,
          totalEstimate: total > 0 ? total : null,
          createdAt: new Date(Date.now() - (orders.length - i) * DAY),
          items: {
            create: lines.map((l) => ({
              quantity: l.quantity,
              priceAtOrder: l.price,
              productId: l.id,
            })),
          },
        },
      });
    }
    console.log(`✓ Sample WhatsApp orders (${orders.length})`);
  } else {
    console.log("✓ Sample WhatsApp orders (skipped, table not empty)");
  }
}

async function main() {
  const shouldReset = process.env.RESET_CATALOG === "true";
  console.log(`Seeding (RESET_CATALOG=${shouldReset})...\n`);

  if (shouldReset) {
    const orders = await prisma.whatsAppOrder.count();
    if (orders > 0 && process.env.FORCE_RESET !== "yes") {
      throw new Error(
        `Refusing to reset: ${orders} WhatsApp orders exist and would be deleted. Set FORCE_RESET=yes only if you have a backup and really mean it.`,
      );
    }
    await resetCatalog();
  } else {
    console.log(
      "Skipping reset (RESET_CATALOG not set to 'true') — adding new data only.\n",
    );
  }

  const categories = await seedCategories();
  const collections = await seedCollections();
  await seedProducts(categories, collections);
  await seedBlogs();
  await seedHeroSlides();

  if (process.env.SEED_SAMPLE_ORDERS === "true") {
    await seedSampleOrders();
  } else {
    console.log(
      "Skipping sample carts/orders (set SEED_SAMPLE_ORDERS=true to add them).",
    );
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
