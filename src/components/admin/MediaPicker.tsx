"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { uploadMedia } from "@/lib/actions/media";
import { voidAction } from "@/lib/actions/form-action";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";
import type { MediaRow } from "@/lib/database.types";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  media: MediaRow[];
  onSelect: (item: MediaRow) => void;
}

export function MediaPicker({ open, onClose, media, onSelect }: MediaPickerProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { notify } = useToast();

  const upload = async (formData: FormData) => {
    setPending(true);
    setError("");

    const result = await uploadMedia(formData);

    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    notify("Image uploaded");

    return result;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Media library"
      description="Choose an image, or upload a new one. Images must be jpeg, png, webp or svg, up to 5 MB."
    >
      <form action={voidAction(upload)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="picker-file" className="drawing-label text-sm">
            Upload an image
          </label>
          <input
            id="picker-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2 text-sm file:mr-3 file:border-2 file:border-ink file:bg-tracing file:px-3 file:py-1 file:font-medium"
          />
        </div>
        <div>
          <label htmlFor="picker-alt" className="drawing-label text-sm">
            Image description
          </label>
          <input
            id="picker-alt"
            name="alt"
            type="text"
            placeholder="Describe the image for people who cannot see it"
            className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2"
          />
        </div>

        {error ? (
          <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Uploading image" : "Upload image"}
          </Button>
        </div>
        <p className="text-sm text-ink-muted">
          After uploading, pick it from the list below on the next page refresh.
        </p>
      </form>

      {media.length === 0 ? (
        <p className="mt-6 border-2 border-dashed border-ink p-6 text-center">
          No images yet. Upload the first one above.
        </p>
      ) : (
        <ul className="mt-6 grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {media.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                data-autofocus
                onClick={() => onSelect(item)}
                className="flex w-full flex-col gap-2 border-2 border-ink bg-paper p-2 text-left hover:bg-drafting"
              >
                <Image
                  src={item.url}
                  alt={item.alt ?? ""}
                  width={160}
                  height={160}
                  className="h-24 w-full object-cover"
                  unoptimized
                />
                <span className="truncate text-xs">
                  {item.alt?.trim() || "No description"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
