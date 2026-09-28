import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";

/**
 * One extension set for the editor and the server-side renderer, so stored
 * documents always render with the same schema they were written with.
 */
export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  LinkExtension.configure({
    openOnClick: false,
    autolink: true,
    protocols: ["http", "https", "mailto", "tel"],
    HTMLAttributes: { rel: "noopener noreferrer nofollow" },
  }),
  ImageExtension.configure({
    allowBase64: false,
    inline: false,
  }),
];
