import type { CSSProperties } from "react";

/** Per-element start offset for the draw-in animation. */
function delay(value: string): CSSProperties {
  return { "--delay": value } as CSSProperties;
}

/**
 * The plan drawing behind the hero. Lines draw themselves once on load;
 * `prefers-reduced-motion` is handled in globals.css.
 */
export function PlanDrawing({ className = "text-ink" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 400"
      className={`draw h-full w-full ${className}`}
      role="img"
      aria-label="Architectural plan drawing of a building outline with dimension lines"
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.28">
        {Array.from({ length: 13 }, (_, index) => (
          <line
            key={`v${index}`}
            x1={index * 40}
            y1="0"
            x2={index * 40}
            y2="400"
            style={delay("0.05s")}
          />
        ))}
        {Array.from({ length: 10 }, (_, index) => (
          <line
            key={`h${index}`}
            x1="0"
            y1={index * 40}
            x2="520"
            y2={index * 40}
            style={delay("0.05s")}
          />
        ))}
      </g>

      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <rect x="70" y="70" width="230" height="180" style={delay("0.1s")} />
        <rect x="300" y="70" width="150" height="110" style={delay("0.35s")} />
        <rect x="300" y="180" width="150" height="70" style={delay("0.5s")} />
        <rect x="150" y="250" width="200" height="80" style={delay("0.65s")} />
        <line x1="70" y1="250" x2="300" y2="250" style={delay("0.8s")} />
        <line x1="230" y1="70" x2="230" y2="250" style={delay("0.9s")} />
      </g>

      <g fill="none" stroke="#F26A1B" strokeWidth="3" strokeLinecap="square">
        <path d="M70 50h230" style={delay("1s")} />
        <path d="M70 44v12M300 44v12" style={delay("1.05s")} />
        <path d="M490 70v180" style={delay("1.1s")} />
        <path d="M484 70h12M484 250h12" style={delay("1.15s")} />
      </g>

      <g stroke="currentColor" strokeWidth="1.5" style={delay("1.2s")}>
        <path d="M40 20v30M34 20h12M34 50h12" fill="none" />
        <path d="M470 320v40M464 320h12M464 360h12" fill="none" />
        <circle cx="40" cy="200" r="10" fill="none" />
        <path d="M30 200h20M40 190v20" fill="none" />
      </g>
    </svg>
  );
}
