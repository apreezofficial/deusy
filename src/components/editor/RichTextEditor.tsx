"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import type { Content } from "@tiptap/core";
import {
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import { editorExtensions } from "@/lib/editor/extensions";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { MediaRow } from "@/lib/database.types";

interface RichTextEditorProps {
  name: string;
  initialContent: Content;
  media: MediaRow[];
  label?: string;
  error?: string;
}

export function RichTextEditor({
  name,
  initialContent,
  media,
  label = "Content",
  error,
}: RichTextEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [value, setValue] = useState("");

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-site max-w-none px-4 py-4",
        "aria-label": label,
      },
    },
    onCreate: ({ editor: instance }) => setValue(JSON.stringify(instance.getJSON())),
    onUpdate: ({ editor: instance }) => setValue(JSON.stringify(instance.getJSON())),
  });

  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="drawing-label text-sm">{label}</span>

      <div
        className={`tiptap-surface border-2 border-ink bg-paper ${
          invalid ? "border-signal" : ""
        }`}
      >
        <EditorToolbar
          editor={editor}
          onOpenPicker={() => setPickerOpen(true)}
          onRequestDelete={() => {
            if (!editor) return;
            if (editor.isActive("image")) editor.chain().focus().deleteSelection().run();
          }}
        />

        <EditorContent editor={editor} className="min-h-64" />

        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          readOnly
          hidden
        />
      </div>

      {error ? <p className="text-sm text-signal-dark">{error}</p> : null}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        media={media}
        onSelect={(item) => {
          if (!editor) return;
          editor
            .chain()
            .focus()
            .setImage({ src: item.url, alt: item.alt ?? "" })
            .run();
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

function EditorToolbar({
  editor,
  onOpenPicker,
  onRequestDelete,
}: {
  editor: Editor | null;
  onOpenPicker: () => void;
  onRequestDelete: () => void;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState("");

  if (!editor) {
    return <div className="border-b-2 border-ink bg-tracing px-3 py-2" aria-hidden="true" />;
  }

  const applyLink = () => {
    const value = linkValue.trim();
    if (!value) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkOpen(false);
      setLinkError("");
      return;
    }

    const normalised = /^(https?:\/\/|mailto:|tel:)/i.test(value)
      ? value
      : `https://${value}`;

    if (!/^(https?:\/\/|mailto:|tel:)\S+$/i.test(normalised)) {
      setLinkError("Enter a full link, for example https://example.com");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: normalised }).run();
    setLinkOpen(false);
    setLinkValue("");
    setLinkError("");
  };

  const tools = [
    {
      label: "Heading 2",
      icon: Heading2,
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Heading 3",
      icon: Heading3,
      active: editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Bulleted list",
      icon: List,
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Blockquote",
      icon: Quote,
      active: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Horizontal rule",
      icon: Minus,
      active: false,
      run: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b-2 border-ink bg-tracing p-2">
      {tools.map((tool) => (
        <ToolbarButton
          key={tool.label}
          label={tool.label}
          icon={tool.icon}
          active={tool.active}
          onClick={tool.run}
        />
      ))}

      <ToolbarButton
        label="Link"
        icon={Link2}
        active={editor.isActive("link")}
        onClick={() => {
          setLinkValue(editor.getAttributes("link").href ?? "");
          setLinkError("");
          setLinkOpen(true);
        }}
      />
      <ToolbarButton label="Image" icon={ImageIcon} active={false} onClick={onOpenPicker} />

      {editor.isActive("image") ? (
        <ToolbarButton
          label="Remove image"
          icon={Trash2}
          active={false}
          onClick={onRequestDelete}
        />
      ) : null}

      <div className="ml-auto flex gap-1">
        <ToolbarButton
          label="Undo"
          icon={Undo2}
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2}
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />
      </div>

      {linkOpen ? (
        <div className="w-full border-t-2 border-ink bg-paper p-3">
          <label htmlFor="editor-link" className="drawing-label text-sm">
            Link address
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="editor-link"
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
              placeholder="https://example.com"
              autoFocus
              aria-invalid={linkError ? true : undefined}
              className={`w-full border-2 border-ink bg-paper px-3 py-2 ${
                linkError ? "border-signal" : ""
              }`}
            />
            <div className="flex gap-2">
              <Button onClick={applyLink} size="sm">
                {linkValue.trim() ? "Apply link" : "Remove link"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLinkOpen(false);
                  setLinkError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
          {linkError ? <p className="mt-2 text-sm text-signal-dark">{linkError}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  active,
  onClick,
  disabled,
}: {
  label: string;
  icon: typeof Bold;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center border-2 transition-colors ${
        active
          ? "border-ink bg-signal"
          : "border-transparent hover:border-ink hover:bg-paper"
      } disabled:opacity-40`}
    >
      <Icon size={16} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
