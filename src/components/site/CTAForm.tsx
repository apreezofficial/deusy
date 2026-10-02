"use client";

import Link from "next/link";
import { useState } from "react";

export function CTAForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = "/contact?intent=consultation";
  }

  return (
    <form className="mt-10 max-w-md" onSubmit={handleSubmit}>
      <label htmlFor="cta-email" className="block text-sm font-medium text-ink-muted mb-2">
        Email<span className="text-signal">*</span>
      </label>
      <input
        type="email"
        id="cta-email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-paper text-ink px-4 py-3 focus:outline-none focus:ring-2 focus:ring-signal"
      />

      <div className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          id="cta-consent"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 border-2 border-signal bg-transparent accent-signal focus:ring-signal focus:ring-offset-ink"
        />
        <label htmlFor="cta-consent" className="text-xs text-ink-muted leading-relaxed">
          By submitting, you consent to being contacted about our services per our{" "}
          <Link href="/legal" className="underline hover:text-paper">Privacy Policy</Link>{" "}
          &amp;{" "}
          <Link href="/legal" className="underline hover:text-paper">Terms</Link>.
        </label>
      </div>

      <button
        type="submit"
        className="mt-8 flex w-full justify-center bg-signal px-6 py-4 text-center font-bold text-ink transition-transform hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--color-paper)]"
      >
        Submit
      </button>
    </form>
  );
}
