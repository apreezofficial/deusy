import { getAllFaqs } from "@/lib/queries/admin";
import { FaqManager } from "@/components/admin/FaqManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqs();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="display text-4xl">FAQs</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          The questions shown on the FAQ page, in the order visitors see them.
        </p>
      </header>

      <FaqManager faqs={faqs} />
    </div>
  );
}
