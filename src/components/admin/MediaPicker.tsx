"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import type { MediaRow } from "@/lib/database.types";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  media: MediaRow[];
  onSelect: (item: MediaRow) => void;
}

/** Chooses an image that has already been uploaded to the media table. */
export function MediaPicker({ open, onClose, media, onSelect }: MediaPickerProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const term = query.trim().toLowerCase();
  const results = term
    ? media.filter(
        (item) =>
          item.url.toLowerCase().includes(term) ||
          (item.alt ?? "").toLowerCase().includes(term),
      )
    : media;

  return (
    <Dialog open={open} onClose={onClose} title="Choose an image" description="Pick from the images already uploaded.">
      <div className="flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by file name or description"
          aria-label="Search images"
          className="control w-full border-2 border-ink bg-paper px-3 py-2.5"
        />

        {results.length === 0 ? (
          <EmptyState
            title="Nothing to choose from."
            description="Upload an image from the media page first, then it will appear here."
          />
        ) : (
          <ul className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="block w-full border-2 border-ink transition-transform hover:-translate-y-0.5"
                >
                  <Image
                    src={item.url}
                    alt={item.alt ?? ""}
                    width={160}
                    height={160}
                    className="h-24 w-full bg-tracing object-cover"
                    unoptimized
                  />
                  <span className="block truncate px-2 py-1 text-left text-xs">
                    {item.alt || item.path.split("/").pop()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
