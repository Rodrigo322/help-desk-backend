import { forwardRef, TextareaHTMLAttributes } from "react";

import { FormField } from "./form-field";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <FormField label={label} error={error}>
      <textarea
        ref={ref}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-brand-500 transition focus:border-brand-500 focus:bg-white focus:ring-2 ${className}`}
        {...props}
      />
    </FormField>
  );
});
