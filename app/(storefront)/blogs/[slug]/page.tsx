import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedBlogBySlug } from "@/lib/data/blogs";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { BlogPostSkeleton } from "./blog-post-skeleton";
import { BlogPostContent } from "@/components/site/blog/blog-post-content";

export const instant = false;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) return {};

  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt;
  const url = `${SITE.siteUrl}/blogs/${blog.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: formatDate(blog.publishedAt || ""),
      modifiedTime: formatDate(blog.updatedAt),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}
