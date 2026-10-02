"use client";

import { useActionState, useState } from "react";
import { submitEnquiry } from "@/lib/actions/enquiries";
import { formAction } from "@/lib/actions/form-action";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ActionResult } from "@/lib/actions/result";

const propertyOrVehicle = "Property or vehicle enquiry";
const somethingElse = "Something else";

const initialState: ActionResult<{ id: string }> | null = null;

interface EnquiryFormProps {
  topics: string[];
  /** Topic chosen by the visitor through a service or call-to-action link. */
  defaultTopic?: string;
  /** Short line explaining why the form looks different on this visit. */
  note?: string;
}

export function EnquiryForm({ topics, defaultTopic, note }: EnquiryFormProps) {
  const [state, formActionHandler] = useActionState(
    formAction(submitEnquiry),
    initialState,
  );
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const sent = state?.ok === true;

  const isShort = touched && message.trim().length > 0 && message.trim().length < 10;

  if (sent) {
    return (
      <div className="edge mt-6 border-2 border-ink bg-tracing p-6">
        <h3 className="drawing-label text-lg">Enquiry sent</h3>
        <p className="mt-2 leading-relaxed">
          Your message is in the inbox for the team. Keep your email handy, and use
          the contact page again if you need to add something.
        </p>
      </div>
    );
  }

  return (
    <form action={formActionHandler} className="mt-6 flex flex-col gap-5" noValidate>
      {state && !state.ok ? (
        <p role="alert" className="edge-sm border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      {note ? (
        <p className="border-2 border-ink bg-tracing px-4 py-3 text-sm leading-relaxed">
          {note}
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
      <Select
        label="What is this about?"
        name="topic"
        defaultValue={defaultTopic ?? propertyOrVehicle}
        error={fieldErrors?.topic}
      >
        {topics.length > 0 ? (
          <optgroup label="Our services">
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </optgroup>
        ) : null}
        <optgroup label="Other">
          <option value={propertyOrVehicle}>{propertyOrVehicle}</option>
          <option value={somethingElse}>{somethingElse}</option>
        </optgroup>
      </Select>
      <div>
        <Textarea
          label="Message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          hint="Describe the property, the vehicle or the problem you are dealing with (at least 10 characters)."
          error={isShort ? "Your message is too short. Please write at least 10 characters." : fieldErrors?.message}
        />
        <div className="mt-1 flex justify-end">
          <span
            className={`text-xs font-mono transition-colors ${
              message.trim().length === 0
                ? "text-ink-muted"
                : message.trim().length < 10
                  ? "text-signal font-bold"
                  : "text-signal-dark font-medium"
            }`}
          >
            {message.trim().length} / 10 min characters
            {message.trim().length >= 10 ? " ✓" : ""}
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-1">
        <SubmitButton pendingLabel="Sending enquiry" size="lg" className="w-full sm:w-auto">
          Send enquiry
        </SubmitButton>
      </div>
    </form>
  );
}
