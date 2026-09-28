"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/lib/actions/enquiries";
import { formAction } from "@/lib/actions/form-action";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ActionResult } from "@/lib/actions/result";

const propertyOrVehicle = "Property or vehicle enquiry";
const somethingElse = "Something else";

const initialState: ActionResult<{ id: string }> | null = null;

export function EnquiryForm({ topics }: { topics: string[] }) {
  const [state, formActionHandler] = useActionState(
    formAction(submitEnquiry),
    initialState,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const sent = state?.ok === true;

  if (sent) {
    return (
      <div className="mt-6 border-2 border-ink bg-tracing p-6">
        <h3 className="drawing-label text-lg">Enquiry sent</h3>
        <p className="mt-2 leading-relaxed">
          Your message is in the inbox for the team. Keep your email handy, and use
          the contact page again if you need to add something.
        </p>
      </div>
    );
  }

  return (
    <form action={formActionHandler} className="mt-6 flex flex-col gap-4" noValidate>
      {state && !state.ok ? (
        <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <Input
        label="Name"
        name="name"
        required
        autoComplete="name"
        error={fieldErrors?.name}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={fieldErrors?.email}
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        hint="Optional"
        error={fieldErrors?.phone}
      />
      <Select label="Topic" name="topic" defaultValue={propertyOrVehicle}>
        {topics.length > 0 ? (
          <optgroup label="Services">
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </optgroup>
        ) : null}
        <option value={propertyOrVehicle}>{propertyOrVehicle}</option>
        <option value={somethingElse}>{somethingElse}</option>
      </Select>
      <Textarea
        label="Message"
        name="message"
        required
        rows={6}
        hint="Describe the property, the vehicle or the problem you are dealing with."
        error={fieldErrors?.message}
      />

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-2">
        <SubmitButton pendingLabel="Sending enquiry" size="lg">
          Send enquiry
        </SubmitButton>
      </div>
    </form>
  );
}
