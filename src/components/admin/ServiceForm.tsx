"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Content } from "@tiptap/core";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { saveService, deleteService } from "@/lib/actions/services";
import { formAction, voidAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { Dialog } from "@/components/ui/Dialog";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { slugify } from "@/components/admin/PageForm";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";
import type { MediaRow, ServiceRow } from "@/lib/database.types";

const emptyDoc = { type: "doc", content: [{ type: "paragraph" }] };

export function ServiceForm({
  service,
  media,
}: {
  service: ServiceRow | null;
  media: MediaRow[];
}) {
  const [state, formActionHandler] = useActionState(
    formAction(saveService),
    null as ActionResult<{ id: string; slug: string }> | null,
  );
  const { notify } = useToast();

  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(service));
  const [scope, setScope] = useState<string[]>(
    service?.scope.length ? service.scope : [""],
  );
  const [image, setImage] = useState(service?.image ?? "");
  const [active, setActive] = useState(service?.active ?? true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const lastResult = useRef(state);

  useEffect(() => {
    if (!state || state === lastResult.current) return;
    lastResult.current = state;

    if (state.ok) notify("Service saved");
  }, [state, notify]);

  return (
    <form action={formActionHandler} className="flex flex-col gap-5">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="active" value={active ? "true" : "false"} />

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
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          error={fieldErrors?.title}
        />
        <Input
          label="Slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          hint={`The page will live at /services/${slug || "..."}`}
          error={fieldErrors?.slug}
        />
        <Select
          label="Kind"
          name="kind"
          defaultValue={service?.kind ?? "practice"}
          hint="Practices sit in the main services list. Agency services sit in the agency block."
        >
          <option value="practice">Practice</option>
          <option value="agency">Agency service</option>
        </Select>
        <Input
          label="Order"
          name="sortOrder"
          type="number"
          min={0}
          max={999}
          defaultValue={service?.sort_order ?? 0}
          hint="Lower numbers appear first."
          error={fieldErrors?.sortOrder}
        />
      </div>

      <Textarea
        label="Summary"
        name="summary"
        required
        rows={3}
        defaultValue={service?.summary ?? ""}
        hint="One or two sentences, shown on the home page and at the top of the detail page."
        error={fieldErrors?.summary}
      />

      <fieldset className="flex flex-col gap-3 border-2 border-ink bg-paper p-5">
        <legend className="drawing-label px-2 text-sm">Scope</legend>
        <p className="text-sm text-ink-muted">
          The list of things this service covers, shown on the detail page.
        </p>

        {scope.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <GripVertical size={16} aria-hidden="true" className="shrink-0 text-ink-muted" />
            <input
              name="scope"
              value={item}
              aria-label={`Scope item ${index + 1}`}
              onChange={(event) => {
                const next = [...scope];
                next[index] = event.target.value;
                setScope(next);
              }}
              className="w-full border-2 border-ink bg-paper px-3 py-2"
            />
            <Button
              type="button"
              variant="quiet"
              size="sm"
              aria-label={`Remove scope item ${index + 1}`}
              onClick={() => setScope(scope.filter((_, position) => position !== index))}
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setScope([...scope, ""])}
          >
            <Plus size={16} aria-hidden="true" />
            Add scope item
          </Button>
        </div>
        {fieldErrors?.scope ? (
          <p className="text-sm text-signal-dark">{fieldErrors.scope}</p>
        ) : null}
      </fieldset>

      <RichTextEditor
        name="body"
        label="Detail"
        media={media}
        initialContent={(service?.body ?? emptyDoc) as Content}
        error={fieldErrors?.body}
      />

      <div className="flex flex-col gap-2">
        <span className="drawing-label text-sm">Image</span>
        <p className="text-sm text-ink-muted">
          {image ? "An image is set for this service." : "No image chosen."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            {image ? "Change image" : "Choose image"}
          </Button>
          {image ? (
            <Button variant="quiet" size="sm" onClick={() => setImage("")}>
              Remove image
            </Button>
          ) : null}
        </div>
        {fieldErrors?.image ? (
          <p className="text-sm text-signal-dark">{fieldErrors.image}</p>
        ) : null}
      </div>

      <Switch
        label="Active"
        checked={active}
        onChange={setActive}
        hint="Inactive services are hidden from the site."
      />

      <div className="flex flex-wrap items-center gap-3 border-2 border-ink bg-paper p-4">
        <Button type="submit">Save service</Button>
        {service ? (
          <>
            <Link
              href={`/services/${service.slug}`}
              target="_blank"
              className="inline-flex h-11 items-center border-2 border-transparent px-5 hover:border-ink hover:bg-tracing"
            >
              View service
            </Link>
            <span className="flex-1" />
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} aria-hidden="true" />
              Delete service
            </Button>
          </>
        ) : null}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        media={media}
        onSelect={(item) => {
          setImage(item.url);
          setPickerOpen(false);
        }}
      />

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this service?"
        description={`"${service?.title}" will be removed from the site. This cannot be undone.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Keep service
            </Button>
            {service ? (
              <form action={voidAction(deleteService)}>
                <input type="hidden" name="id" value={service.id} />
                <Button type="submit" variant="danger">
                  Delete service
                </Button>
              </form>
            ) : null}
          </>
        }
      >
        <p>Links to this service from the home page will stop working.</p>
      </Dialog>
    </form>
  );
}
