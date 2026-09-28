"use client";

import { useId, useState } from "react";
import type { FaqRow } from "@/lib/database.types";

/**
 * One question open at a time: opening a row closes whichever row was open.
 */
export function FaqList({ faqs }: { faqs: FaqRow[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const baseId = useId();

  if (faqs.length === 0) {
    return (
      <p className="edge border-2 border-dashed border-ink bg-paper p-6">
        No questions have been published yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {faqs.map((faq, index) => {
        const open = openId === faq.id;
        const panelId = `${baseId}-panel-${faq.id}`;
        const buttonId = `${baseId}-button-${faq.id}`;

        return (
          <li
            key={faq.id}
            className={`accordion edge-sm border-2 border-ink bg-paper transition-colors ${
              open ? "bg-tracing" : "hover:border-signal-dark"
            }`}
            data-open={open}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="drawing-label mt-0.5 shrink-0 text-sm text-signal-dark"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-lg font-medium leading-snug sm:text-xl">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid h-8 w-8 flex-none place-items-center border-2 border-ink text-xl leading-none transition-[background-color,transform] duration-200 ${
                    open ? "rotate-45 bg-signal" : "bg-paper"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="accordion-panel">
              <div>
                <p className="max-w-[68ch] px-5 pb-6 leading-relaxed text-ink-soft sm:px-6 sm:pl-[3.75rem]">
                  {faq.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
