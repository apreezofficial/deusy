export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "new"
      ? "bg-signal text-ink"
      : status === "read"
        ? "bg-drafting text-ink"
        : "bg-tracing text-ink-muted";

  const label =
    status === "new" ? "New" : status === "read" ? "Read" : "Archived";

  return (
    <span className={`inline-block border-2 border-ink px-2 py-0.5 text-xs ${tone}`}>
      {label}
    </span>
  );
}
