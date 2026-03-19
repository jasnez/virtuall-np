import React from "react";

type Props = React.ComponentPropsWithoutRef<"select"> & {
  label?: string;
  error?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const baseField =
  "w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors";

export const Select = React.forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, className, id, name, required, children, ...props },
  ref,
) {
  const selectId = id ?? name;
  const errorId = error ? `${selectId ?? name ?? "select"}-error` : undefined;

  return (
    <div>
      {label ? (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-main mb-1"
        >
          {label}
        </label>
      ) : null}

      <select
        ref={ref}
        id={selectId}
        name={name}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={cx(baseField, error && "border-error", className)}
        {...props}
      >
        {children}
      </select>

      {error ? (
        <p id={errorId} className="text-sm text-error mt-1">
          {error}
        </p>
      ) : null}
    </div>
  );
});

