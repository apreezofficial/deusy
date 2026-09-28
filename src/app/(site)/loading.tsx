export default function SiteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
    >
      <p className="drawing-label text-sm text-ink-muted">Loading</p>
      <div className="mt-6 h-4 w-2/3 bg-tracing" />
      <div className="mt-3 h-4 w-1/2 bg-tracing" />
      <span className="sr-only">Loading this page.</span>
    </div>
  );
}
