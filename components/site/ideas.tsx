import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cacheLife, cacheTag } from "next/cache";
import { getPublishedBlogs } from "@/lib/data/blogs";

export default async function IdeasBlogSection() {
  "use cache";
  cacheTag("blogs");
  cacheLife("default");

  const blogs = await getPublishedBlogs({ limit: 4 });

  return (
    <section className="py-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Field notes
          </p>

          <h2 className="mt-1 font-sans text-3xl font-medium leading-tight text-foreground">
            Ideas for Your Next Upgrade
          </h2>
        </div>

        <Link
          href="/blogs"
          className="text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          See more ideas
        </Link>
      </div>

      <div className="mt-4.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.slug}`}
            className="group relative flex min-h-52 items-end overflow-hidden rounded-md border border-border bg-cover bg-center"
            style={{ backgroundImage: `url(${blog.coverImage})` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

            <div className="relative z-10 flex w-full items-end justify-between gap-3 p-4">
              <div className="min-w-0 text-white">
                <b className="block truncate text-sm font-semibold">
                  {blog.title}
                </b>

                <span className="mt-1 block text-xs text-white/75">
                  {blog.status}
                </span>
              </div>

              <span
                aria-label={`View ${blog.title}`}
                className="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-md border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-foreground"
              >
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
