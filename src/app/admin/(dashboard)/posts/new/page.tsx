import Link from "next/link";
import { getAllMedia } from "@/lib/queries/admin";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewAdminPostPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/posts"
          className="drawing-label text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          All articles
        </Link>
        <h1 className="display mt-3 text-4xl">Write new article</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Draft and publish news, market insights, and thought leadership for Deusy Investments Services.
        </p>
      </header>

      <PostForm post={null} media={media} />
    </div>
  );
}
