import type { FaqRow } from "@/lib/database.types";

export function FaqList({ faqs }: { faqs: FaqRow[] }) {
  if (faqs.length === 0) {
    return (
      <p className="border-2 border-dashed border-ink p-6">
        No questions have been published yet.
      </p>
    );
  }

  return (
    <div className="border-t-2 border-ink">
      {faqs.map((faq) => (
        <details key={faq.id} className="group border-b-2 border-ink">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium marker:content-none hover:text-signal-dark">
            <span>{faq.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 border-2 border-ink px-2 leading-none group-open:bg-signal"
            >
              +
            </span>
          </summary>
          <div className="max-w-[70ch] pb-6 leading-relaxed text-ink-soft">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
