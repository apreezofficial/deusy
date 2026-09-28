"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, Trash2, Upload } from "lucide-react";
import { uploadMedia, updateMediaAlt, deleteMedia } from "@/lib/actions/media";
import { voidAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";
import type { MediaRow } from "@/lib/database.types";

export function MediaLibrary({ media }: { media: MediaRow[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<MediaRow | null>(null);

  const upload = async (formData: FormData) => {
    setUploading(true);
    setError("");

    const result = await uploadMedia(formData);

    setUploading(false);

    if (!result.ok) {
      setError(result.error);
      return result;
    }

    notify("Image uploaded");
    router.refresh();

    return result;
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      notify("Image address copied");
    } catch {
      notify("Copying failed. Select the address and copy it manually.", "error");
    }
  };

  const remove = async (formData: FormData) => {
    const result = await deleteMedia(formData);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }

    notify("Image deleted");
    setPendingDelete(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <form action={voidAction(upload)} className="border-2 border-ink bg-paper p-5">
        <h2 className="drawing-label text-lg">Upload an image</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Jpeg, png, webp or svg, up to 5 MB. Give every image a description so it
          makes sense to people using a screen reader.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="media-file" className="drawing-label text-sm">
              Image file
            </label>
            <input
              id="media-file"
              name="file"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2 text-sm file:mr-3 file:border-2 file:border-ink file:bg-tracing file:px-3 file:py-1 file:font-medium"
            />
          </div>
          <div>
            <label htmlFor="media-alt" className="drawing-label text-sm">
              Image description
            </label>
            <input
              id="media-alt"
              name="alt"
              type="text"
              placeholder="For example: Site team reviewing building plans"
              className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2"
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 border-2 border-ink bg-signal px-4 py-3">
            {error}
          </p>
        ) : null}

        <div className="mt-4">
          <Button type="submit" disabled={uploading}>
            <Upload size={16} aria-hidden="true" />
            {uploading ? "Uploading image" : "Upload image"}
          </Button>
        </div>
      </form>

      {media.length === 0 ? (
        <p className="border-2 border-dashed border-ink bg-paper p-8 text-center">
          No images yet. Upload the first one above.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onCopy={() => copyUrl(item.url)}
              onDelete={() => setPendingDelete(item)}
            />
          ))}
        </ul>
      )}

      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this image?"
        description="The file is removed from storage and the library. Pages that use it will show a broken image."
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Keep image
            </Button>
            {pendingDelete ? (
              <form action={remove}>
                <input type="hidden" name="id" value={pendingDelete.id} />
                <Button type="submit" variant="danger">
                  Delete image
                </Button>
              </form>
            ) : null}
          </>
        }
      >
        <p>
          If this image is used in page content, a service, a team member or the
          share image, update those first.
        </p>
      </Dialog>
    </div>
  );
}

function MediaCard({
  item,
  onCopy,
  onDelete,
}: {
  item: MediaRow;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const { notify } = useToast();
  const [alt, setAlt] = useState(item.alt ?? "");
  const [saving, setSaving] = useState(false);

  const saveAlt = async (formData: FormData) => {
    setSaving(true);
    const result = await updateMediaAlt(formData);
    setSaving(false);

    if (!result.ok) {
      notify(result.error, "error");
      return result;
    }

    notify("Description saved");
    router.refresh();

    return result;
  };

  return (
    <li className="flex flex-col border-2 border-ink bg-paper">
      <Image
        src={item.url}
        alt={item.alt ?? ""}
        width={640}
        height={420}
        className="h-44 w-full border-b-2 border-ink object-cover"
        unoptimized
      />

      <form action={voidAction(saveAlt)} className="flex flex-1 flex-col gap-3 p-4">
        <input type="hidden" name="id" value={item.id} />
        <div>
          <label htmlFor={`alt-${item.id}`} className="drawing-label text-sm">
            Image description
          </label>
          <input
            id={`alt-${item.id}`}
            name="alt"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            className="mt-1.5 w-full border-2 border-ink bg-paper px-3 py-2 text-sm"
          />
        </div>

        <p className="truncate text-xs text-ink-muted" title={item.path}>
          {item.path}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Saving" : "Save description"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopy}>
            <Copy size={14} aria-hidden="true" />
            Copy address
          </Button>
          <Button type="button" size="sm" variant="danger" onClick={onDelete}>
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </Button>
        </div>
      </form>
    </li>
  );
}
