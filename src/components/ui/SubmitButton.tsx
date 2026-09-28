"use client";

import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  size = "md",
  className,
  name,
  value,
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      name={name}
      value={value}
      disabled={pending || disabled}
    >
      {pending ? (
        <>
          <Loader size={16} className="animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
