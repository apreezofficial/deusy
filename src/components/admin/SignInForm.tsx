"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ActionResult } from "@/lib/actions/result";

const initialState: ActionResult<undefined> | null = null;

export function SignInForm() {
  const [state, formAction] = useActionState(signIn, initialState);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      {state && !state.ok ? (
        <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        autoFocus
        error={fieldErrors?.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        error={fieldErrors?.password}
      />

      <div className="mt-2">
        <SubmitButton pendingLabel="Signing in" size="lg" className="w-full">
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
}
