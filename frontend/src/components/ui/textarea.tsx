import { TextareaHTMLAttributes } from "react";

import { FormField } from "./form-field";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <FormField label={label} error={error}>
      <textarea
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500 transition focus:border-brand-500 focus:ring-2 ${className}`}
        {...props}
      />
    </FormField>
  );
}
