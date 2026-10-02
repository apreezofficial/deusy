import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMedia } from "@/lib/queries/admin";
import { getPost } from "@/lib/queries/content";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditAdminPostPage({ params }: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const [post, media] = await Promise.all([getPost(id), getAllMedia()]);

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/posts"
          className="drawing-label text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          All articles
        </Link>
        <h1 className="display mt-3 text-4xl">{post.title}</h1>
        <p className="mt-2 text-ink-muted">
          {post.published
            ? `Published at /blog/${post.slug}.`
            : `Draft. Visitors cannot see /blog/${post.slug} until you publish it.`}
        </p>
      </header>

      <PostForm post={post} media={media} />
    </div>
  );
}
