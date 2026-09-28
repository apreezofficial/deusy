import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline" | "ink" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,box-shadow,background-color] duration-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-signal text-ink border-2 border-ink shadow-[5px_5px_0_0_var(--color-ink)] hover:bg-signal-dark hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-[5px_5px] active:shadow-none",
  outline:
    "bg-paper text-ink border-2 border-ink shadow-[5px_5px_0_0_var(--color-ink)] hover:bg-tracing hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-[5px_5px] active:shadow-none",
  ink: "bg-ink text-paper border-2 border-ink shadow-[5px_5px_0_0_#8FCBEA] hover:bg-ink-soft hover:shadow-[7px_7px_0_0_#8FCBEA] active:translate-[5px_5px] active:shadow-none",
  quiet:
    "bg-paper text-ink border-2 border-transparent hover:border-ink hover:bg-tracing",
  danger:
    "bg-paper text-ink border-2 border-ink shadow-[5px_5px_0_0_var(--color-ink)] hover:bg-signal hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-[5px_5px] active:shadow-none",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm [--edge-offset:3px]",
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
