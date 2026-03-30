import { ReactNode } from "react";

type BadgeVariant = "default" | "info" | "warning" | "success" | "danger";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  info: "bg-sky-100 text-sky-700",
  warning: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700"
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

