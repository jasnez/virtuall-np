import React from "react";

type Props = React.ComponentPropsWithoutRef<"textarea"> & {
  label?: string;
  error?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const baseField =
  "w-full px-4 py-3 border border-gray-200/90 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-200 ease-out";

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  function Textarea(
    { label, error, className, id, name, required, ...props },
    ref,
  ) {
    const textareaId = id ?? name;
    const errorId = error ? `${textareaId ?? name ?? "textarea"}-error` : undefined;

    return (
      <div>
        {label ? (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-main mb-2"
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          className={cx(
            baseField,
            "min-h-24 resize-y",
            error && "border-error",
            className,
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-sm text-error mt-1">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

