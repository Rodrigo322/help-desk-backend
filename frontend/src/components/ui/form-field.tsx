import { ReactNode } from "react";

type FormFieldProps = {
  label?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-slate-700">
      {label ? <span className="font-semibold text-slate-700">{label}</span> : null}
      {children}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
