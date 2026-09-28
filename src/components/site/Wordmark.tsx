import Link from "next/link";
import Image from "next/image";

interface WordmarkProps {
  name: string;
  logoUrl: string;
  /** Renders the light-on-dark variant used inside the footer. */
  inverted?: boolean;
  className?: string;
}

export function Wordmark({ name, logoUrl, inverted, className = "" }: WordmarkProps) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={220}
        height={48}
        className={`h-10 w-auto ${className}`}
        unoptimized
      />
    );
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className={`grid h-9 w-9 place-items-center border-2 ${
          inverted ? "border-paper bg-paper text-ink" : "border-ink bg-ink text-paper"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M3 21V6l9-3v18M12 8h9v13M6 10h3M6 14h3M15 12h3M15 16h3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="display text-[1.05rem]">Deusy &amp; Planners</span>
        <span
          className={`text-[0.7rem] tracking-wide ${
            inverted ? "text-drafting" : "text-ink-muted"
          }`}
        >
          Services
        </span>
      </span>
    </span>
  );
}

export function WordmarkLink({
  name,
  logoUrl,
  inverted,
  className,
}: WordmarkProps) {
  return (
    <Link href="/" className="inline-flex" aria-label={`${name}, home`}>
      <Wordmark name={name} logoUrl={logoUrl} inverted={inverted} className={className} />
    </Link>
  );
}
