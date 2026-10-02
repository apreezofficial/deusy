"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import type { Content } from "@tiptap/core";
import { Trash2 } from "lucide-react";
import { savePost, deletePost } from "@/lib/actions/posts";
import { formAction, voidAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { Dialog } from "@/components/ui/Dialog";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/ui/Toast";
import { slugify } from "@/components/admin/PageForm";
import type { ActionResult } from "@/lib/actions/result";
import type { BlogPostRow, MediaRow } from "@/lib/database.types";

const emptyDoc = { type: "doc", content: [{ type: "paragraph" }] };

interface PostFormProps {
  post: BlogPostRow | null;
  media: MediaRow[];
}

export function PostForm({ post, media }: PostFormProps) {
  const [state, formActionHandler] = useActionState(
    formAction(savePost),
    null as ActionResult<{ id: string; slug: string; published: boolean }> | null,
  );
  const { notify } = useToast();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [published, setPublished] = useState(post?.published ?? false);
  const [category, setCategory] = useState(post?.category ?? "General");
  const [author, setAuthor] = useState(post?.author ?? "Deusy Team");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const notified = useRef<typeof state>(undefined);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  const [savedResult, setSavedResult] = useState<typeof state>(null);
  if (state !== savedResult) {
    setSavedResult(state);
    if (state?.ok) setDirty(false);
  }

  useEffect(() => {
    if (!state || state === notified.current) return;
    notified.current = state;

    if (state.ok) {
      notify(state.data.published ? "Post published" : "Draft saved");
    }
  }, [state, notify]);

  useEffect(() => {
    if (!dirty) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submitWith = (nextPublished: boolean) => {
    flushSync(() => setPublished(nextPublished));
    formRef.current?.requestSubmit();
  };

  return (
    <form ref={formRef} action={formActionHandler} className="flex flex-col gap-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="published" value={published ? "true" : "false"} />

      {state && !state.ok ? (
        <div
          role="alert"
          className="border-2 border-signal bg-signal/10 p-4 text-sm text-signal-dark font-medium"
        >
          {state.error}
        </div>
      ) : null}

      {/* Title & Slug */}
      <div className="border-2 border-ink bg-paper p-5 sm:p-6 flex flex-col gap-5">
        <Input
          label="Post Title"
          name="title"
          required
          value={title}
          error={fieldErrors?.title}
          onChange={(e) => {
            setDirty(true);
            setTitle(e.target.value);
            if (!slugTouched) {
              setSlug(slugify(e.target.value));
            }
          }}
          placeholder="e.g. Navigating Real Estate Investment in Greater Accra"
        />

        <div>
          <Input
            label="Slug (URL identifier)"
            name="slug"
            required
            value={slug}
            error={fieldErrors?.slug}
            onChange={(e) => {
              setDirty(true);
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            hint={`Public address: /blog/${slug || "..."}`}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Category"
            name="category"
            value={category}
            onChange={(e) => {
              setDirty(true);
              setCategory(e.target.value);
            }}
            placeholder="e.g. Real Estate, HR, Construction"
          />

          <Input
            label="Author"
            name="author"
            value={author}
            onChange={(e) => {
              setDirty(true);
              setAuthor(e.target.value);
            }}
            placeholder="e.g. Eric Semanu-Uzziah Dornyo"
          />
        </div>

        <Textarea
          label="Short Excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          onChange={() => setDirty(true)}
          error={fieldErrors?.excerpt}
          placeholder="A brief summary of the article displayed on the blog index and social cards."
          rows={3}
        />
      </div>

      {/* Cover Image */}
      <div className="border-2 border-ink bg-paper p-5 sm:p-6">
        <h2 className="display text-lg">Cover Image</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Header image for the blog post and preview cards.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {coverImage ? (
            <div className="relative aspect-[16/9] w-full max-w-md border-2 border-ink bg-tracing overflow-hidden">
              <Image
                src={coverImage}
                alt="Post cover preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="coverImage" value={coverImage} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              {coverImage ? "Change cover image" : "Choose from media library"}
            </Button>
            {coverImage ? (
              <Button
                type="button"
                variant="quiet"
                size="sm"
                onClick={() => {
                  setDirty(true);
                  setCoverImage("");
                }}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Rich Text Editor for Content */}
      <div className="border-2 border-ink bg-paper p-5 sm:p-6">
        <RichTextEditor
          name="content"
          initialContent={(post?.content as Content) ?? emptyDoc}
          media={media}
          label="Post Content"
          error={fieldErrors?.content}
        />
      </div>

      {/* Publish & Status Controls */}
      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-paper p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
        <div className="flex items-center gap-3">
          <Switch
            checked={published}
            onChange={(checked: boolean) => {
              setDirty(true);
              setPublished(checked);
            }}
            label="Published"
          />
          <span className="text-xs text-ink-muted">
            {published ? "Visible on live site" : "Draft (hidden from public)"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {post ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={16} />
              Delete post
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => submitWith(false)}
          >
            Save draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => submitWith(true)}
          >
            {published ? "Update post" : "Publish post"}
          </Button>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        media={media}
        onSelect={(item) => {
          setDirty(true);
          setCoverImage(item.url);
          setPickerOpen(false);
        }}
      />

      {post ? (
        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Delete this post?"
          description={`"${post.title}" will be permanently removed from the blog. This cannot be undone.`}
          footer={
            <>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Keep post
              </Button>
              <form action={voidAction(() => deletePost(post.id))}>
                <Button type="submit" variant="danger">
                  Delete post
                </Button>
              </form>
            </>
          }
        >
          <p className="text-sm text-ink-muted">
            The post URL /blog/{post.slug} will no longer be available.
          </p>
        </Dialog>
      ) : null}
    </form>
  );
}
