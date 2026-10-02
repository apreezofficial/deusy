import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts, getSiteSettings } from "@/lib/queries/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();

  return {
    title: "Blog & Insights",
    description: `Read the latest articles, guides, and updates from ${site.name}.`,
    alternates: { canonical: "/blog" },
    openGraph: {
      type: "website",
      title: `Blog & Insights | ${site.name}`,
      description: `Articles on construction, real estate, HR compliance, and business consultancy in Ghana.`,
    },
  };
}

export default async function BlogIndexPage() {
  const [site, posts] = await Promise.all([getSiteSettings(), getPublishedPosts()]);

  return (
    <>
      <header className="grid-plan border-b-2 border-ink bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="drawing-label border-b-2 border-ink pb-2 text-sm text-signal-dark uppercase tracking-wider">
            Insights &amp; Updates
          </p>
          <h1 className="display mt-6 text-[clamp(2.5rem,1.5rem+3.5vw,4.25rem)]">
            Articles &amp; Industry Advice.
          </h1>
          <p className="mt-5 max-w-[62ch] text-lg text-ink-soft sm:text-xl">
            Practical insights on property acquisition, construction management, labor compliance,
            and sustainable business development across Ghana.
          </p>
        </div>
      </header>

      <section className="border-b-2 border-ink bg-paper px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="border-2 border-dashed border-ink p-12 text-center">
              <h2 className="display text-2xl">No articles published yet</h2>
              <p className="mt-2 text-ink-muted">
                Check back soon or visit our admin panel to publish the first post.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col border-2 border-ink bg-paper transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
                >
                  {post.cover_image ? (
                    <div className="relative aspect-[16/10] w-full border-b-2 border-ink bg-tracing overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] w-full border-b-2 border-ink bg-tracing flex items-center justify-center text-ink-muted font-mono text-xs">
                      DEUSY INSIGHTS
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-2 text-xs text-ink-muted mb-3">
                      <span className="drawing-label font-bold text-signal uppercase tracking-wider">
                        {post.category || "Article"}
                      </span>
                      {post.published_at ? (
                        <span>{formatDate(post.published_at)}</span>
                      ) : null}
                    </div>

                    <h2 className="display text-2xl leading-tight group-hover:underline group-hover:decoration-signal group-hover:decoration-2 group-hover:underline-offset-4">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {post.excerpt ? (
                      <p className="mt-4 text-ink-soft leading-relaxed line-clamp-3 text-sm flex-1">
                        {post.excerpt}
                      </p>
                    ) : null}

                    <div className="mt-6 pt-4 border-t border-ink/15 flex items-center justify-between text-xs font-medium">
                      <span className="text-ink-muted">{post.author || "Deusy Team"}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-signal-dark font-bold underline decoration-signal decoration-2 underline-offset-4"
                      >
                        Read article →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
