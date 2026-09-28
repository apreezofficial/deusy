import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-ink bg-paper px-6 py-12 text-center">
      <p className="drawing-label text-lg">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-prose text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
