export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <p className="drawing-label text-sm text-ink-muted">Loading</p>
      <div className="h-8 w-1/3 bg-paper" />
      <div className="h-40 w-full bg-paper" />
      <span className="sr-only">Loading this section of the admin panel.</span>
    </div>
  );
}
