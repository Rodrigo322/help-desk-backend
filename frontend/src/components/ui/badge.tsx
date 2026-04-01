import { ReactNode } from "react";

type BadgeVariant = "default" | "info" | "warning" | "success" | "danger";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border border-slate-200",
  info: "bg-brand-100 text-brand-700 border border-brand-100",
  warning: "bg-amber-100 text-amber-700 border border-amber-100",
  success: "bg-emerald-100 text-emerald-700 border border-emerald-100",
  danger: "bg-red-100 text-red-700 border border-red-100"
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
