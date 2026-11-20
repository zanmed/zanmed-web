import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { getPublishedBlogBySlug } from "@/lib/data/blogs";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { tiptapContentClass } from "@/lib/tiptap-content-class";

export async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: formatDate(blog.publishedAt || ""),
    dateModified: formatDate(blog.updatedAt),
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.siteUrl}/blogs/${blog.slug}`,
    },
  };

  const contentHtml = sanitizeHtml(blog.content);

  return (
    <main className="bg-background font-sans text-foreground py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline mb-4"
        >
          <ArrowLeft size={13} /> Back to Field Notes & Articles
        </Link>

        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="border-b border-border pb-4">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-primary">
                  Clinical Insights
                </span>
                <span>·</span>
                {blog.publishedAt && (
                  <time
                    dateTime={new Date(blog.publishedAt).toISOString()}
                    className="flex items-center gap-1 font-mono"
                  >
                    {formatDate(blog.publishedAt)}
                  </time>
                )}
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-tight">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {blog.excerpt}
                </p>
              )}
            </div>

            <div className="relative mt-5 aspect-video w-full overflow-hidden  border border-border bg-soft">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div
              className={`mt-6 text-xs sm:text-sm leading-relaxed text-foreground ${tiptapContentClass}`}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {blog.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1 mr-1">
                  Tags:
                </span>
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border bg-soft px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className=" border border-primary/30 bg-primary/5 p-4 shadow-xs">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Facility Procurement
                </span>
                <h3 className="mt-1 text-sm font-bold text-foreground">
                  Need machinery or supplies mentioned in this article?
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Zanmed Medical Supplies Ltd offers direct sourcing,
                  warranties, and technical installation across Kenya.
                </p>

                <div className="mt-4 space-y-2">
                  <Link
                    href="/products"
                    className="inline-flex h-8 w-full items-center justify-center  bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Browse Equipment Catalog
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-8 w-full items-center justify-center  border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-soft"
                  >
                    Request Technical BOQ
                  </Link>
                </div>
              </div>

              <div className=" border border-border bg-card p-4">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  Speak with Biomedical Support
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Have questions regarding site readiness, lead shielding, or
                  lab analyzer specs?
                </p>

                <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                  {SITE.phone && (
                    <a
                      href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      <Phone size={13} className="text-primary" /> {SITE.phone}
                    </a>
                  )}
                  {SITE.email && (
                    <a
                      href={`mailto:${SITE.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[11px]"
                    >
                      <MessageSquare size={13} className="text-primary" />{" "}
                      {SITE.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
