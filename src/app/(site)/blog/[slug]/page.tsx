import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPost, getSiteSettings } from "@/lib/queries/content";
import { RichText } from "@/components/site/RichText";
import { JsonLd } from "@/components/site/JsonLd";
import { formatDate } from "@/lib/format";
import { buttonStyles } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [post, site] = await Promise.all([getPublishedPost(slug), getSiteSettings()]);

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} · ${site.name}`,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · ${site.name}`,
      description: post.excerpt || undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: PageProps<"/[slug]">) {
  const { slug } = await params;
  const [post, site] = await Promise.all([getPublishedPost(slug), getSiteSettings()]);

  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.cover_image ? [post.cover_image] : undefined,
          datePublished: post.published_at || post.created_at,
          author: {
            "@type": "Person",
            name: post.author || site.name,
          },
        }}
      />

      <article className="border-b-2 border-ink bg-paper">
        {/* Header Section */}
        <header className="grid-plan border-b-2 border-ink px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted mb-4">
              <Link
                href="/blog"
                className="drawing-label font-bold text-signal-dark uppercase tracking-wider hover:underline"
              >
                ← Blog &amp; Insights
              </Link>
              <span>•</span>
              <span className="font-semibold text-ink uppercase tracking-wide">
                {post.category || "Article"}
              </span>
              {post.published_at ? (
                <>
                  <span>•</span>
                  <span>{formatDate(post.published_at)}</span>
                </>
              ) : null}
            </div>

            <h1 className="display text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] leading-tight text-ink">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-6 text-xl text-ink-soft leading-relaxed max-w-prose">
                {post.excerpt}
              </p>
            ) : null}

            <div className="mt-8 pt-4 border-t border-ink/20 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">
                By <strong className="font-bold">{post.author || "Deusy Investments Services"}</strong>
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image if available */}
        {post.cover_image ? (
          <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
            <div className="relative aspect-[16/9] w-full border-2 border-ink bg-tracing overflow-hidden shadow-[5px_5px_0_0_var(--color-ink)]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ) : null}

        {/* Post Body Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rich-text-content max-w-none text-lg leading-relaxed">
            <RichText doc={post.content} />
          </div>

          {/* Bottom Back Button & Contact prompt */}
          <div className="mt-16 pt-8 border-t-2 border-ink flex flex-wrap items-center justify-between gap-4">
            <Link href="/blog" className={buttonStyles("outline", "md")}>
              ← Back to all articles
            </Link>
            <Link href="/contact?intent=consultation" className={buttonStyles("primary", "md")}>
              Talk with our team
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
