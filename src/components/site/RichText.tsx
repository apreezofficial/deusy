import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import { editorExtensions } from "@/lib/editor/extensions";
import type { Json } from "@/lib/database.types";

function isRenderableDoc(value: Json | null | undefined): value is JSONContent {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (value as { type?: unknown }).type === "doc"
  );
}

/**
 * Renders stored Tiptap JSON. The markup is produced by the Tiptap schema, not
 * by string concatenation, so it only ever contains the nodes and marks the
 * editor allows.
 */
export function RichText({ doc, className = "" }: { doc: Json | null; className?: string }) {
  if (!isRenderableDoc(doc)) return null;

  const html = generateHTML(doc as JSONContent, editorExtensions);

  return (
    <div
      className={`prose-site ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
