"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { savePage, deletePage, checkPageSlug } from "@/lib/actions/pages";
import { voidAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { Dialog } from "@/components/ui/Dialog";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/ui/Toast";
import { reservedSlugs } from "@/lib/validation/schemas";
import type { ActionResult } from "@/lib/actions/result";
import type { MediaRow, PageRow } from "@/lib/database.types";

const emptyDoc = { type: "doc", content: [{ type: "paragraph" }] };

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

interface PageFormProps {
  page: PageRow | null;
  media: MediaRow[];
}

export function PageForm({ page, media }: PageFormProps) {
  const [state, formActionHandler] = useActionState(
    formAction(savePage),
    null as ActionResult<{ id: string; slug: string; published: boolean }> | null,
  );
  const { notify } = useToast();

  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(page));
  const [published, setPublished] = useState(page?.published ?? false);
  const [showInNav, setShowInNav] = useState(page?.show_in_nav ?? false);
  const [ogImage, setOgImage] = useState(page?.og_image ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const lastResult = useRef<typeof state>(undefined);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  useEffect(() => {
    if (!state || state === lastResult.current) return;
    lastResult.current = state;

    if (state.ok) {
      setDirty(false);
      notify(state.data.published ? "Page published" : "Draft saved");
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

  const reserved = (reservedSlugs as readonly string[]).includes(slug);

  return (
    <form ref={formRef} action={formActionHandler} className="flex flex-col gap-6">
      {page ? <input type="hidden" name="id" value={page.id} /> : null}
      <input type="hidden" name="published" value={published ? "true" : "false"} />
      <input type="hidden" name="showInNav" value={showInNav ? "true" : "false"} />
      <input type="hidden" name="ogImage" value={ogImage} />

      {state && !state.ok ? (
        <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Title"
          name="title"
          required
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setDirty(true);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          error={fieldErrors?.title}
        />

        <SlugField
          slug={slug}
          currentId={page?.id}
          onChange={(value) => {
            setSlug(value);
            setDirty(true);
          }}
          onTouch={() => setSlugTouched(true)}
          error={fieldErrors?.slug}
          reserved={reserved}
        />
      </div>

      <Input
        label="Subtitle"
        name="subtitle"
        defaultValue={page?.subtitle ?? ""}
        onChange={() => setDirty(true)}
        hint="One line shown under the page title."
        error={fieldErrors?.subtitle}
      />

      <Select
        label="Template"
        name="template"
        defaultValue={page?.template ?? "standard"}
        onChange={() => setDirty(true)}
        hint="Standard renders rich text, FAQ lists questions, Contact shows the enquiry form."
        error={fieldErrors?.template}
      >
        <option value="standard">Standard</option>
        <option value="faq">FAQ</option>
        <option value="contact">Contact</option>
      </Select>

      <RichTextEditor
        name="content"
        label="Content"
        media={media}
        initialContent={page?.content ?? emptyDoc}
        error={fieldErrors?.content}
      />

      <fieldset className="grid gap-4 border-2 border-ink bg-paper p-5 sm:grid-cols-2">
        <legend className="drawing-label px-2 text-sm">Visibility</legend>
        <Switch
          label="Published"
          checked={published}
          onChange={(value) => {
            setPublished(value);
            setDirty(true);
          }}
          hint="Drafts return a 404 for visitors and can be previewed while signed in."
        />
        <Switch
          label="Show in navigation"
          checked={showInNav}
          onChange={(value) => {
            setShowInNav(value);
            setDirty(true);
          }}
          hint="Adds this page to the header and footer menus."
        />
        <Input
          label="Navigation label"
          name="navLabel"
          defaultValue={page?.nav_label ?? ""}
          onChange={() => setDirty(true)}
          hint="Leave empty to use the page title."
          error={fieldErrors?.navLabel}
        />
        <Input
          label="Navigation order"
          name="navOrder"
          type="number"
          min={0}
          max={999}
          defaultValue={page?.nav_order ?? 0}
          onChange={() => setDirty(true)}
          hint="Lower numbers appear first."
          error={fieldErrors?.navOrder}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-2 border-ink bg-paper p-5">
        <legend className="drawing-label px-2 text-sm">Search and sharing</legend>
        <Input
          label="Search title"
          name="seoTitle"
          defaultValue={page?.seo_title ?? ""}
          onChange={() => setDirty(true)}
          hint="Leave empty to use the page title."
          error={fieldErrors?.seoTitle}
        />
        <Textarea
          label="Search description"
          name="seoDesc"
          rows={3}
          defaultValue={page?.seo_desc ?? ""}
          onChange={() => setDirty(true)}
          hint="Leave empty to use the subtitle."
          error={fieldErrors?.seoDesc}
        />

        <div className="flex flex-col gap-2">
          <span className="drawing-label text-sm">Share image</span>
          {ogImage ? (
            <Image
              src={ogImage}
              alt="Share image preview"
              width={320}
              height={200}
              className="h-32 w-full max-w-xs border-2 border-ink object-cover"
              unoptimized
            />
          ) : (
            <p className="text-sm text-ink-muted">No share image chosen.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              {ogImage ? "Change image" : "Choose image"}
            </Button>
            {ogImage ? (
              <Button
                variant="quiet"
                size="sm"
                onClick={() => {
                  setOgImage("");
                  setDirty(true);
                }}
              >
                Remove image
              </Button>
            ) : null}
          </div>
          {fieldErrors?.ogImage ? (
            <p className="text-sm text-signal-dark">{fieldErrors.ogImage}</p>
          ) : null}
        </div>
      </fieldset>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-2 border-ink bg-paper p-4">
        <Button type="submit" variant="outline" onClick={() => submitWith(false)}>
          Save draft
        </Button>
        <Button type="submit" onClick={() => submitWith(true)}>
          Publish page
        </Button>

        {page ? (
          <>
            <a
              href={`/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center border-2 border-transparent px-5 hover:border-ink hover:bg-tracing"
            >
              View page
            </a>
            <span className="flex-1" />
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} aria-hidden="true" />
              Delete page
            </Button>
          </>
        ) : null}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        media={media}
        onSelect={(item) => {
          setOgImage(item.url);
          setDirty(true);
          setPickerOpen(false);
        }}
      />

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this page?"
        description={`"${page?.title}" will be removed from the site and the navigation. This cannot be undone.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Keep page
            </Button>
            <form action={deletePage}>
              {page ? <input type="hidden" name="id" value={page.id} /> : null}
              <Button type="submit" variant="danger">
                Delete page
              </Button>
            </form>
          </>
        }
      >
        <p>
          If the page is linked from the header or the footer, those links will be
          removed with it.
        </p>
      </Dialog>
    </form>
  );
}

function SlugField({
  slug,
  currentId,
  onChange,
  onTouch,
  error,
  reserved,
}: {
  slug: string;
  currentId?: string;
  onChange: (value: string) => void;
  onTouch: () => void;
  error?: string;
  reserved: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "checking" | "free" | "taken">("idle");

  useEffect(() => {
    const value = slug.trim();

    if (!value) {
      setStatus("idle");
      return;
    }

    if (reserved) {
      setStatus("taken");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      setStatus("idle");
      return;
    }

    setStatus("checking");
    const timer = setTimeout(async () => {
      const result = await checkPageSlug(value, currentId);
      setStatus(result.ok ? (result.data.available ? "free" : "taken") : "idle");
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, currentId, reserved]);

  const message =
    status === "taken"
      ? reserved
        ? "That slug is reserved by the site. Choose another one."
        : "That slug is already used by another page."
      : error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="slug" className="drawing-label text-sm">
        Slug
      </label>
      <input
        id="slug"
        name="slug"
        required
        value={slug}
        onChange={(event) => {
          onTouch();
          onChange(event.target.value);
        }}
        aria-invalid={message ? true : undefined}
        aria-describedby="slug-status"
        className={`w-full border-2 border-ink bg-paper px-3 py-2 ${
          message ? "border-signal" : ""
        }`}
      />
      <p id="slug-status" className="text-sm text-ink-muted">
        The page will live at /{slug || "…"}
        {status === "checking" ? " (checking)" : ""}
        {status === "free" ? " (available)" : ""}
      </p>
      {message ? <p className="text-sm text-signal-dark">{message}</p> : null}
    </div>
  );
}
