import { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

