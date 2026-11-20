import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Activity,
  Stethoscope,
  Scan,
  Award,
  Heart,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  Syringe,
  Bed,
  Sparkles,
  Layers,
  Cross,
  Package,
} from "lucide-react";
import { SITE } from "@/lib/constants";

export const instant = false;

export const metadata: Metadata = {
  title: `About Us | ${SITE.name} - Complete Medical Supplies, Machinery & Facility Solutions`,
  description:
    "Zanmed Medical Supplies Ltd offers laboratory equipment, operating theatre machinery, dental equipment, mortuary equipment, hospital furniture, PPE, mobility aids, and turnkey hospital construction in Kenya.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About Zanmed Medical Supplies Ltd | Medical Equipment & Hospital Contracting`,
    description:
      "Comprehensive healthcare supplier providing everything from home care essentials and clinical consumables to operating theatre, dental, and mortuary machinery across East Africa.",
    type: "website",
  },
};

const primaryButton =
  "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const outlineButton =
  "inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-xs font-semibold text-foreground transition-all duration-150 hover:bg-soft hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const mainDepartments = [
  {
    icon: FlaskConical,
    title: "Laboratory Equipment",
    desc: "Centrifuges, microscopes, incubators, chemistry analyzers, and clinical diagnostic machinery.",
  },
  {
    icon: Syringe,
    title: "Lab Consumables & Reagents",
    desc: "Test kits, blood collection tubes, chemical reagents, specimen containers, and lab glassware.",
  },
  {
    icon: Activity,
    title: "Medical Equipment",
    desc: "CT Scanners, Digital X-Rays, Hematology Analyzers, Ultrasound units, and patient monitors.",
  },
  {
    icon: Heart,
    title: "Home Care",
    desc: "Oxygen concentrators, nebulizers, blood glucose monitors, suction machines, and care kits.",
  },
  {
    icon: Bed,
    title: "Hospital Furniture",
    desc: "Electric & manual ward beds, examination couches, bedside lockers, overtables, and IV stands.",
  },
  {
    icon: Cross,
    title: "Mobility Aids",
    desc: "Wheelchairs, crutches, walking frames, rollators, orthopedic supports, and patient transfer gear.",
  },
  {
    icon: Building2,
    title: "Mortuary Equipment",
    desc: "Mortuary refrigerators, embalming tables, body stretchers, autopsy stations, and storage racks.",
  },
  {
    icon: Stethoscope,
    title: "Operating Theatre",
    desc: "Anesthesia workstations, surgical lights, hydraulic OT tables, electrosurgical units, and autoclaves.",
  },
  {
    icon: Scan,
    title: "Dental Equipment",
    desc: "Ergonomic Dental Chairs, dental X-Rays, scaling units, curing lights, and dental handpieces.",
  },
  {
    icon: ShieldCheck,
    title: "PPE & Hygiene",
    desc: "Surgical masks, nitrile gloves, protective gowns, sanitizers, and clinical waste disposal.",
  },
];

const featuredCollections = [
  {
    title: "Bedridden Patient Care",
    desc: "Air mattresses, anti-bedsore pads, waterproof sheets, and specialized mobility solutions.",
    href: "/products?collection=bedridden-patient-care",
  },
  {
    title: "Clinic Setup",
    desc: "Turnkey diagnostic packages, furniture bundles, and essential screening tools for new clinics.",
    href: "/products?collection=clinic-setup",
  },
  {
    title: "Deals of the Week",
    desc: "Exclusive discounted rates on essential medical consumables, equipment, and lab supplies.",
    href: "/products?collection=deals-of-the-week",
  },
  {
    title: "Diabetes & Hypertension Care",
    desc: "Glucometers, test strips, digital BP monitors, insulin accessories, and daily tracking gear.",
    href: "/products?collection=diabetes-hypertension-care",
  },
  {
    title: "Home Care Essentials",
    desc: "Curated daily health monitors, first aid kits, wound care supplies, and wellness essentials.",
    href: "/products?collection=home-care-essentials",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Consultation & Procurement Scoping",
    text: "We advise on machinery specs, product selection, and facility requirements for clinics and individuals.",
  },
  {
    step: "02",
    title: "Supply, Delivery & Installation",
    text: "Rapid delivery of home care supplies or professional installation and calibration of heavy equipment.",
  },
  {
    step: "03",
    title: "Training & Technical Support",
    text: "Bio-medical engineer support, staff training, and preventive maintenance SLAs across Kenya.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background font-sans text-foreground">
      <section className="relative border-b border-border bg-soft py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              Quality Supplies. Trusted Care.
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Complete Medical Supplies, Advanced Equipment & Hospital
              Contracting in Kenya.
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {SITE.name} is a leading medical distributor and hospital
              contractor based in Nairobi. We specialize in supplying everything
              from lab reagents, home care products, and PPE to heavy diagnostic
              machinery, operating theater systems, mortuary equipment, and full
              turnkey hospital construction.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/products" className={primaryButton}>
                Explore Full Catalog
              </Link>
              <Link href="/contact" className={outlineButton}>
                Contact Sales & Engineering
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="capabilities-heading"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Product Departments
            </p>
            <h2
              id="capabilities-heading"
              className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl"
            >
              What We Supply
            </h2>
          </div>
          <p className="max-w-md text-xs text-muted-foreground">
            Sourced from ISO-certified global manufacturers for hospitals,
            clinics, labs, and home use.
          </p>
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {mainDepartments.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="group rounded-md border border-border bg-card p-3.5 transition-all duration-200 hover:border-primary"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <Icon size={16} />
              </span>
              <h3 className="mt-2.5 text-xs font-bold text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-soft py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Curated Healthcare Collections
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {featuredCollections.map((col) => (
              <Link
                key={col.title}
                href={col.href}
                className="group flex flex-col justify-between rounded-md border border-border bg-background p-3.5 transition-all hover:border-primary hover:shadow-xs"
              >
                <div>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {col.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {col.desc}
                  </p>
                </div>
                <span className="mt-3 block text-[10px] font-semibold text-primary">
                  Shop Collection &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md border border-border bg-soft p-4 shadow-xs sm:p-5">
            <div className="grid gap-4 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Turnkey Facility Contracting
                </span>
                <h3 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
                  Building, Outfitting & Furnishing Hospitals & Clinics
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Our biomedical engineering team plans, constructs, and
                  furnishes modern healthcare centers. We install Medical Gas
                  Pipeline Systems (MGPS), fit out ICUs and Operating Theatres,
                  construct lead-shielded Radiology suites, outfit dental rooms,
                  install mortuary refrigeration, and supply all clinical
                  furniture.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs font-medium text-foreground sm:grid-cols-3">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary" /> ICU & OT
                    Suite Setup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary" />{" "}
                    Lead-Lined X-Ray Rooms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary" /> Medical
                    Gas Lines (MGPS)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary" /> Mortuary
                    Cold Rooms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary" /> Dental
                    Unit Setup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary" />{" "}
                    Laboratory Outfitting
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-4 md:items-end md:justify-center">
                <Link href="/contact" className={primaryButton}>
                  Request Turnkey Proposal
                </Link>
                <span className="text-[10px] text-muted-foreground">
                  Compliant with MOH & PPB standards in Kenya
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Execution Process */}
      <section
        aria-labelledby="workflow-heading"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <div className="text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Execution Process
          </p>
          <h2
            id="workflow-heading"
            className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl"
          >
            How We Partner With Care Providers
          </h2>
        </div>

        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {processSteps.map((step) => (
            <li
              key={step.title}
              className="rounded-md border border-border bg-card p-3.5"
            >
              <span className="text-[11px] font-extrabold text-primary">
                {step.step}
              </span>
              <h3 className="mt-1 text-xs font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-md bg-primary p-4 text-primary-foreground sm:p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-bold sm:text-lg">
              Planning a healthcare upgrade, facility build, or home care order?
            </h2>
            <p className="mt-0.5 text-xs text-primary-foreground/80">
              Speak directly with our technical team for custom quotations,
              tender fulfillment, or product assistance.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-background px-4 text-xs font-semibold text-foreground transition-colors duration-150 hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Speak with a Representative
          </Link>
        </div>
      </section>
    </main>
  );
}
