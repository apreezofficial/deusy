import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlBase =
  "control w-full bg-paper text-ink border-2 border-ink px-3 py-2.5 text-[0.95rem] placeholder:text-ink-muted disabled:bg-tracing disabled:text-ink-muted";

const controlInvalid = "border-signal bg-signal/5";

function describedBy(
  id: string,
  error?: string,
  hint?: string,
): string | undefined {
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  name,
  error,
  hint,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="drawing-label text-sm">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${controlBase} ${error ? controlInvalid : ""} ${className}`}
        {...props}
      />
      <FieldNote id={name} error={error} hint={hint} />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  name,
  error,
  hint,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="drawing-label text-sm">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${controlBase} min-h-32 resize-y leading-relaxed ${error ? controlInvalid : ""} ${className}`}
        {...props}
      />
      <FieldNote id={name} error={error} hint={hint} />
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Select({
  label,
  name,
  error,
  hint,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="drawing-label text-sm">
        {label}
      </label>
      <select
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${controlBase} cursor-pointer pr-10 font-medium ${error ? controlInvalid : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      <FieldNote id={name} error={error} hint={hint} />
    </div>
  );
}

function FieldNote({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: string;
}) {
  if (!error && !hint) return null;
  return (
    <>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-signal-dark">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
    </>
  );
}

export { controlBase, controlInvalid };
