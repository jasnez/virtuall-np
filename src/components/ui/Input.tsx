import React from "react";

type Props = Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
  label?: string;
  error?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const baseField =
  "w-full px-4 py-3 border border-gray-200/90 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-200 ease-out";

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, id, name, required, type = "text", ...props },
  ref,
) {
  const inputId = id ?? name;
  const errorId = error ? `${inputId ?? name ?? "input"}-error` : undefined;

  return (
    <div>
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-main mb-2"
        >
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        name={name}
        required={required}
        type={type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={cx(baseField, error && "border-error", className)}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-sm text-error mt-1">
          {error}
        </p>
      ) : null}
    </div>
  );
});

