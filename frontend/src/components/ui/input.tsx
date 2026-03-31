import { InputHTMLAttributes } from "react";

import { FormField } from "./form-field";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <FormField label={label} error={error}>
      <input
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500 transition focus:border-brand-500 focus:ring-2 ${className}`}
        {...props}
      />
    </FormField>
  );
}
