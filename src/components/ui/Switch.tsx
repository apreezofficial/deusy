"use client";

import { useId } from "react";

interface SwitchProps {
  label: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}

export function Switch({
  label,
  name,
  checked,
  onChange,
  hint,
  disabled,
}: SwitchProps) {
  const id = useId();
  const descriptionId = hint ? `${id}-hint` : undefined;

  return (
    <div className="flex items-start justify-between gap-4 border-2 border-ink bg-paper px-4 py-3">
      <div>
        <label htmlFor={id} className="drawing-label text-sm cursor-pointer">
          {label}
        </label>
        {hint ? (
          <p id={descriptionId} className="text-sm text-ink-muted mt-0.5">
            {hint}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        id={id}
        name={name}
        role="switch"
        aria-checked={checked}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-14 shrink-0 border-2 border-ink transition-colors ${
          checked ? "bg-signal" : "bg-paper"
        } disabled:opacity-50`}
      >
        <span className="sr-only">{checked ? "On" : "Off"}</span>
        <span
          aria-hidden="true"
          className={`absolute top-0.5 h-4 w-6 bg-ink transition-all ${
            checked ? "left-7" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
