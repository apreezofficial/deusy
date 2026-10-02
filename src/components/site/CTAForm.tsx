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
    <form className="mt-8 max-w-lg" onSubmit={handleSubmit}>
      <label htmlFor="cta-email" className="block text-sm text-[#c8bfb9] mb-2 font-sans font-medium">
        Email<span className="text-signal">*</span>
      </label>
      <input
        type="email"
        id="cta-email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-paper text-ink px-4 py-3.5 text-base font-sans focus:outline-none focus:ring-2 focus:ring-signal"
      />

      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="cta-consent"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="h-4 w-4 shrink-0 rounded-none border border-signal bg-transparent accent-signal cursor-pointer"
        />
        <label htmlFor="cta-consent" className="text-xs text-[#a39790] leading-relaxed select-none">
          By submitting, you consent to being contacted about our products per our{" "}
          <Link href="/privacy-policy" className="underline hover:text-paper transition-colors">Privacy Policy</Link>{" "}
          &amp;{" "}
          <Link href="/terms" className="underline hover:text-paper transition-colors">Terms</Link>.
        </label>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="flex-1 flex justify-center items-center bg-signal py-4 px-6 text-center font-bold text-ink text-base tracking-wide border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-ink)] active:translate-y-0.5"
        >
          Contact us
        </button>
        <Link
          href="/contact?intent=consultation"
          className="flex-1 flex justify-center items-center bg-paper py-4 px-6 text-center font-bold text-ink text-base tracking-wide border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-tracing hover:shadow-[6px_6px_0_0_var(--color-ink)] active:translate-y-0.5"
        >
          Request consultation
        </Link>
      </div>
    </form>
  );
}
