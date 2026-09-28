export function DraftBanner({ title }: { title: string }) {
  return (
    <div className="border-b-2 border-ink bg-signal">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-6">
        <span className="drawing-label">Draft preview</span>
        <p className="text-sm">
          &ldquo;{title}&rdquo; is not published, so visitors cannot see this page.
        </p>
      </div>
    </div>
  );
}
