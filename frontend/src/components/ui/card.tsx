import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  );
}
