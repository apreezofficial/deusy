"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { saveFaq, toggleFaqActive, moveFaq, deleteFaq } from "@/lib/actions/faqs";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import type { FaqRow } from "@/lib/database.types";

export function FaqManager({ faqs }: { faqs: FaqRow[] }) {
  const [editing, setEditing] = useState<FaqRow | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FaqRow | null>(null);
  const { notify } = useToast();

  const move = (faq: FaqRow, direction: "up" | "down", message: string) => {
    const formData = new FormData();
    formData.set("id", faq.id);
    formData.set("direction", direction);

    void (async () => {
      const result = await moveFaq(formData);
      notify(result.ok ? message : result.error, result.ok ? "success" : "error");
    })();
  };

  const toggle = async (faq: FaqRow) => {
    const formData = new FormData();
    formData.set("id", faq.id);
    formData.set("active", String(!faq.active));

    const result = await toggleFaqActive(formData);
    if (result.ok) {
      notify(faq.active ? "Question hidden" : "Question published");
    } else {
      notify(result.error, "error");
    }
  };

  const save = async (formData: FormData) => {
    const result = await saveFaq(formData);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }

    notify("Question saved");
    setEditing(null);
  };

  const remove = async (formData: FormData) => {
    const result = await deleteFaq(formData);
    notify(result.ok ? "Question deleted" : result.error, result.ok ? "success" : "error");
    setPendingDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-muted">
          {faqs.length} {faqs.length === 1 ? "question" : "questions"} on the FAQ page.
        </p>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} aria-hidden="true" />
          Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <p className="border-2 border-dashed border-ink bg-paper p-8 text-center">
          No FAQs yet. Add the first one.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <li key={faq.id} className="border-2 border-ink bg-paper p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="drawing-label text-lg">{faq.question}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{faq.answer}</p>
                </div>
                <span
                  className={`shrink-0 border-2 border-ink px-2 py-0.5 text-xs ${
                    faq.active ? "bg-drafting" : "bg-tracing text-ink-muted"
                  }`}
                >
                  {faq.active ? "Published" : "Hidden"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => move(faq, "up", "Question moved up")}
                >
                  <ArrowUp size={14} aria-hidden="true" />
                  Move up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={index === faqs.length - 1}
                  onClick={() => move(faq, "down", "Question moved down")}
                >
                  <ArrowDown size={14} aria-hidden="true" />
                  Move down
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(faq)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => void toggle(faq)}>
                  {faq.active ? "Hide" : "Publish"}
                </Button>
                <span className="flex-1" />
                <Button variant="danger" size="sm" onClick={() => setPendingDelete(faq)}>
                  <Trash2 size={14} aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add a question" : "Edit question"}
        description="Answer only what you can stand behind. Do not quote fees, timelines or policies."
      >
        {editing ? (
          <form action={save} className="flex flex-col gap-4">
            {editing !== "new" ? <input type="hidden" name="id" value={editing.id} /> : null}
            <Input
              label="Question"
              name="question"
              required
              defaultValue={editing === "new" ? "" : editing.question}
            />
            <Textarea
              label="Answer"
              name="answer"
              required
              rows={5}
              defaultValue={editing === "new" ? "" : editing.answer}
            />
            <Input
              label="Order"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={editing === "new" ? faqs.length + 1 : editing.sort_order}
              hint="Use the move up and down buttons to reorder."
            />
            <input
              type="hidden"
              name="active"
              value={editing === "new" || editing.active ? "true" : "false"}
            />

            <div className="flex flex-wrap justify-end gap-3 border-t-2 border-ink pt-4">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">
                {editing === "new" ? "Add question" : "Save changes"}
              </Button>
            </div>
          </form>
        ) : null}
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this question?"
        description={
          pendingDelete
            ? `"${pendingDelete.question}" will be removed from the FAQ page. This cannot be undone.`
            : ""
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Keep question
            </Button>
            {pendingDelete ? (
              <form action={remove}>
                <input type="hidden" name="id" value={pendingDelete.id} />
                <Button type="submit" variant="danger">
                  Delete question
                </Button>
              </form>
            ) : null}
          </>
        }
      >
        <p>The question and its answer are both removed.</p>
      </Dialog>
    </div>
  );
}
