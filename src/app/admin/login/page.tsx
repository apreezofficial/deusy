import type { Metadata } from "next";
import { Wordmark } from "@/components/site/Wordmark";
import { SignInForm } from "@/components/admin/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-between bg-ink px-6 py-10 text-paper sm:px-10">
        <Wordmark name="Deusy &amp; Planners Services" logoUrl="" inverted />
        <div className="py-16">
          <p className="drawing-label text-sm text-drafting">Admin panel</p>
          <h1 className="display mt-4 text-[clamp(2.25rem,1.5rem+3vw,3.5rem)]">
            Manage the site without a developer.
          </h1>
          <p className="mt-5 max-w-[45ch] leading-relaxed text-drafting">
            Pages, services, questions, team, enquiries and settings. Sign in with
            the account that was invited to this panel.
          </p>
        </div>
        <p className="text-sm text-drafting">
          Building People | Planning Solutions | Creating Value
        </p>
      </div>

      <div className="grid-plan flex items-center justify-center bg-tracing px-6 py-16 sm:px-10">
        <div className="w-full max-w-md border-2 border-ink bg-paper p-6 sm:p-8">
          <h2 className="display text-3xl">Sign in</h2>
          <p className="mt-2 text-ink-muted">
            Use the email address your administrator invited.
          </p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
