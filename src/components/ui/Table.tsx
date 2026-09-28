import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="edge-sm overflow-x-auto border-2 border-ink bg-paper">
      <table className="w-full border-collapse text-left text-[0.95rem]">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-tracing border-b-2 border-ink">
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`drawing-label whitespace-nowrap px-4 py-3 text-sm ${className}`}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <tr className={`border-b-2 border-ink last:border-b-0 ${className}`}>{children}</tr>;
}

export function TD({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
