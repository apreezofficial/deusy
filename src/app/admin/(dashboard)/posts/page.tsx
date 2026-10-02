import Link from "next/link";
import { getPosts } from "@/lib/queries/content";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Blog &amp; Articles</h1>
          <p className="mt-2 max-w-prose text-ink-muted">
            Publish insights, industry updates, real estate advice, and company news.
            Published articles automatically appear on the public <Link href="/blog" className="underline hover:text-signal">/blog</Link> page.
          </p>
        </div>
        <Link href="/admin/posts/new" className={buttonStyles("primary", "md")}>
          New article
        </Link>
      </header>

      {posts.length === 0 ? (
        <EmptyState
          title="No blog posts yet."
          description="Create your first article to share news, real estate guides, or business consultancy insights."
          action={
            <Link href="/admin/posts/new" className={buttonStyles("primary", "md")}>
              Write an article
            </Link>
          }
        />
      ) : (
        <Table>
          <THead>
            <TH>Title</TH>
            <TH>Category</TH>
            <TH>Author</TH>
            <TH>Status</TH>
            <TH>Published date</TH>
          </THead>
          <TBody>
            {posts.map((post) => (
              <TR key={post.id}>
                <TD>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-medium underline decoration-signal decoration-2 underline-offset-4 hover:text-signal"
                  >
                    {post.title}
                  </Link>
                  <span className="block text-xs text-ink-muted">/blog/{post.slug}</span>
                </TD>
                <TD className="text-ink-muted">{post.category || "General"}</TD>
                <TD className="text-ink-muted">{post.author || "Deusy Team"}</TD>
                <TD>
                  <StatusPill status={post.published ? "published" : "draft"} />
                </TD>
                <TD className="text-ink-muted">
                  {post.published_at ? formatDate(post.published_at) : "—"}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
