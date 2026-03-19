"use client";

import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "nav";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function sizeClasses(size: ButtonSize, variant: ButtonVariant) {
  if (variant === "nav") return "";
  if (variant === "ghost") {
    // keep ghost minimal; size only affects text
    if (size === "sm") return "text-sm";
    if (size === "lg") return "text-lg";
    return "text-base";
  }
  if (size === "sm") return "px-4 py-2 text-sm";
  if (size === "lg") return "px-8 py-4 text-lg";
  return "px-6 py-3 text-base";
}

const focusRing =
  "focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none";

const transitionUi =
  "transition-colors duration-200 ease-out";

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  onClick,
  className,
  disabled,
  type = "button",
}: CommonProps) {
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const cn = className ?? "";
  const overrides = {
    hasBg: /\bbg-/.test(cn),
    hasHoverBg: /\bhover:bg-/.test(cn),
    hasText: /\btext-(white|accent|accent-dark|primary|text-main|text-light)\b/.test(cn) || /\btext-\[/.test(cn),
    hasHoverText:
      /\bhover:text-(white|accent|accent-dark|primary|text-main|text-light)\b/.test(cn) || /\bhover:text-\[/.test(cn),
  };

  function variantClassesWithOverrides(v: ButtonVariant) {
    switch (v) {
      case "secondary": {
        const parts = ["rounded-xl", "border-2", "border-accent", transitionUi];
        if (!overrides.hasText) parts.push("text-accent");
        if (!overrides.hasHoverBg) parts.push("hover:bg-accent");
        if (!overrides.hasText && !overrides.hasHoverText) parts.push("hover:text-white");
        return parts.join(" ");
      }
      case "ghost":
        return [
          overrides.hasText ? null : "text-accent",
          "underline",
          transitionUi,
          overrides.hasHoverText || overrides.hasText ? null : "hover:text-accent-dark",
        ]
          .filter(Boolean)
          .join(" ");
      case "nav":
        return [
          overrides.hasBg ? null : "bg-accent-dark",
          overrides.hasText ? null : "text-white",
          "px-5",
          "py-2.5",
          "rounded-xl",
          "text-sm font-semibold",
          "hover:bg-accent-dark/90",
          transitionUi,
        ]
          .filter(Boolean)
          .join(" ");
      case "primary":
      default: {
        const parts = [];
        if (!overrides.hasBg) parts.push("bg-accent-dark");
        if (!overrides.hasText) parts.push("text-white");
        parts.push("px-6", "py-3", "rounded-xl");
        if (!overrides.hasHoverBg) parts.push("hover:bg-accent-dark/90");
        parts.push(transitionUi);
        return parts.join(" ");
      }
    }
  }

  const classes = cx(
    "inline-flex items-center justify-center min-h-[44px] min-w-[44px]",
    focusRing,
    variantClassesWithOverrides(variant),
    sizeClasses(size, variant),
    disabledClasses,
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.(e);
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

