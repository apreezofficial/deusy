import Link from "next/link";
import Image from "next/image";

/** The mark shipped in /public. Used unless Settings carries its own logo. */
const fallbackLogo = "/logo.png";

interface WordmarkProps {
  name: string;
  logoUrl: string;
  /** Renders the light-on-dark variant used inside the footer. */
  inverted?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Wordmark({
  name,
  logoUrl,
  inverted,
  className = "",
}: WordmarkProps) {
  const src = logoUrl.trim() || fallbackLogo;

  return (
    <span
      className={`flex items-center ${inverted ? "bg-paper px-3 py-2" : ""} ${className}`}
    >
      <Image
        src={src}
        alt={name}
        width={3293}
        height={1813}
        priority
        unoptimized
        className="h-9 w-auto sm:h-10"
      />
    </span>
  );
}

export function WordmarkLink({
  name,
  logoUrl,
  inverted,
  className,
  onClick,
}: WordmarkProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="inline-flex"
      aria-label={`${name}, home`}
    >
      <Wordmark name={name} logoUrl={logoUrl} inverted={inverted} className={className} />
    </Link>
  );
}
