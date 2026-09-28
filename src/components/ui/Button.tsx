import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline" | "ink" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-signal text-ink border-2 border-ink hover:bg-signal-dark",
  outline: "bg-paper text-ink border-2 border-ink hover:bg-tracing",
  ink: "bg-ink text-paper border-2 border-ink hover:bg-ink-soft",
  quiet:
    "bg-transparent text-ink border-2 border-transparent hover:border-ink hover:bg-tracing",
  danger: "bg-paper text-ink border-2 border-ink hover:bg-signal",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, size, className)}
      {...props}
    />
  );
}
