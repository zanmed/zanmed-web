import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ArrowRight,
  Search,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { getPublishedBlogs } from "@/lib/data/blogs";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Medical Machinery & Hospital Procurement Blog | ${SITE.name}`,
  description: `Expert buying guides, biomedical maintenance tips, CT/X-Ray selection advice, and hospital construction insights from ${SITE.name} in Nairobi, Kenya.`,
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: `Medical Equipment & Clinical Procurement Insights | Zanmed`,
    description:
      "Technical reviews, hospital outfitting advice, and lab equipment guides written for healthcare professionals in East Africa.",
    type: "website",
  },
};

type Blog = Awaited<ReturnType<typeof getPublishedBlogs>>[number];

const blogTopics = [
  "All Articles",
  "Diagnostic & Radiology",
  "Operating Theatre & ICU",
  "Laboratory & Hematology",
  "Hospital Construction & Furnishing",
  "Home Care & Mobility",
];

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();
  const [featured, ...rest] = blogs;

  return (
    <main className="bg-background font-sans text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-fulll px-2 lg:px-4">
        <div className="relative rounded-lg border border-border bg-soft p-3 sm:p-5">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <BookOpen size={13} /> Healthcare Engineering & Procurement Hub
              </span>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Clinical Insights, Equipment Reviews & Hospital Outfitting
                Guides
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Expert technical guidance from {SITE.name}'s biomedical team.
                Learn how to select CT scanners, set up lead-shielded X-Ray
                suites, equip lab analyzers, and procure compliant medical
                consumables in Kenya.
              </p>
            </div>

            <div className=" border border-border bg-card p-4 shadow-xs lg:col-span-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                Facility Consultations
              </span>
              <h2 className="mt-1 text-xs font-bold text-foreground">
                Planning a new clinic or hospital facility?
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                Get a custom technical proposal and BOQ from our biomedical
                engineering team.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex h-8 w-full items-center justify-center  bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Request Free BOQ Quotation
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1 flex items-center gap-1">
              <Filter size={11} /> Filter Topics:
            </span>
            {blogTopics.map((topic, i) => (
              <span
                key={topic}
                className={`cursor-pointer border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  i === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {!featured ? (
            <div className=" border border-dashed border-border bg-card p-8 sm:p-12 text-center">
              <h2 className="text-sm font-bold text-foreground">
                No clinical articles published yet
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                Our biomedical team is currently preparing new technical reviews
                and hospital setup guides.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex h-9 items-center justify-center  bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse Equipment Catalogue
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Featured Procurement Guide
                </p>
                <FeaturedPost blog={featured} />
              </div>

              {rest.length > 0 && (
                <section
                  aria-labelledby="latest-articles"
                  className="mt-8 border-t border-border pt-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      id="latest-articles"
                      className="text-base font-bold text-foreground"
                    >
                      Latest Medical Articles & Equipment Reviews
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      Showing {rest.length} articles
                    </span>
                  </div>

                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((blog, idx) => (
                      <li key={blog.slug}>
                        <PostCard blog={blog} />
                      </li>
                    ))}

                    <li className="flex flex-col justify-between  border border-primary/30 bg-primary/5 p-4">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-primary">
                          <CheckCircle2 size={12} /> Zanmed Medical Services
                        </span>
                        <h3 className="mt-2 text-sm font-bold text-foreground">
                          Direct Equipment Sourcing & Tender Fulfillment
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                          Can't find the technical specification you're looking
                          for? We supply full CT, X-Ray, Dental, ICU, and Lab
                          setups directly with warranty.
                        </p>
                      </div>
                      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
                        <Link
                          href="/contact"
                          className="inline-flex h-8 w-full items-center justify-center  bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Talk to a Biomedical Specialist
                        </Link>
                      </div>
                    </li>
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function PostDate({ value }: { value: Blog["publishedAt"] }) {
  if (!value) return null;
  return (
    <time
      dateTime={new Date(value).toISOString()}
      className="text-[10px] font-mono text-muted-foreground"
    >
      {formatDate(value)}
    </time>
  );
}

function FeaturedPost({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group grid gap-4  border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:grid-cols-12 lg:items-center lg:gap-6"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden  bg-soft lg:col-span-7">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-103"
        />
        <span className="absolute top-2.5 left-2.5 rounded-xs bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
          Pillar Guide
        </span>
      </div>
      <div className="lg:col-span-5">
        <div className="flex items-center gap-2">
          <PostDate value={blog.publishedAt} />
          <span className="text-[10px] text-muted-foreground">
            · 5 min read
          </span>
        </div>
        <h2 className="mt-1 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
          {blog.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {blog.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
          Read Full Technical Review <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col justify-between  border border-border bg-card p-3.5 transition-all hover:border-primary hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        <div className="relative aspect-16/10 w-full overflow-hidden  bg-soft">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-103"
          />
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <PostDate value={blog.publishedAt} />
            <span className="text-[10px] text-muted-foreground">· Guide</span>
          </div>
          <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm">
            {blog.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-border/50 pt-2 flex items-center justify-between text-[10px] font-semibold text-primary">
        <span>Read Article</span>
        <ArrowRight
          size={11}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
