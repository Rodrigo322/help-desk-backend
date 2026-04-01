import { forwardRef, SelectHTMLAttributes } from "react";

import { FormField } from "./form-field";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className = "", ...props },
  ref
) {
  return (
    <FormField label={label} error={error}>
      <select
        ref={ref}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-brand-500 transition focus:border-brand-500 focus:bg-white focus:ring-2 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
});
