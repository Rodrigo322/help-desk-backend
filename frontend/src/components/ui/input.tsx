import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

