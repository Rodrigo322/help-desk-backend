import { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export function Select({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

