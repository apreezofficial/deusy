import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

export default function SiteNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="drawing-label text-sm text-signal-dark">Error 404</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,1.5rem+4vw,4rem)]">
        This page is not on the plan.
      </h1>
      <p className="mt-5 max-w-[58ch] text-lg text-ink-soft">
        The address you followed does not match anything on this site. It may have
        moved, or the page may not be published yet.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className={buttonStyles("primary", "lg")}>
          Back to the home page
        </Link>
        <Link href="/contact" className={buttonStyles("outline", "lg")}>
          Request a consultation
        </Link>
      </div>
    </div>
  );
}
