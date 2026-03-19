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

/** Solid CTAs: 44–48px tall; horizontal padding in 18–24px range (18px md: 24px). */
function solidSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-11 min-h-[44px] min-w-[44px] px-4 md:px-5";
    case "lg":
      return "h-12 min-h-[48px] min-w-[44px] px-6 md:px-6";
    case "md":
    default:
      return "h-12 min-h-[48px] min-w-[44px] px-[18px] md:px-6";
  }
}

function typographyAndSize(size: ButtonSize, variant: ButtonVariant): string {
  if (variant === "ghost") {
    if (size === "sm") return "text-sm font-medium";
    if (size === "lg") return "text-lg font-medium";
    return "text-base font-medium";
  }
  const effective: ButtonSize = variant === "nav" ? "md" : size;
  return `${solidSizeClasses(effective)} text-base font-semibold`;
}

const focusRing =
  "focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none";

const transitionBtn =
  "transition-[transform,background-color,color,border-color,opacity] duration-200 ease-out";

const hoverLift =
  "hover:-translate-y-px active:translate-y-0 disabled:hover:translate-y-0";

const solidLayout = "inline-flex items-center justify-center gap-2 rounded-xl";

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
    hasText:
      /\btext-(white|accent|accent-dark|primary|text-main|text-light)\b/.test(cn) ||
      /\btext-\[/.test(cn),
    hasHoverText:
      /\bhover:text-(white|accent|accent-dark|primary|text-main|text-light)\b/.test(cn) ||
      /\bhover:text-\[/.test(cn),
  };

  function variantColorClasses(v: ButtonVariant): string {
    switch (v) {
      case "secondary": {
        const parts = [
          "border border-gray-300 bg-white",
          !overrides.hasText && "text-text-main",
          !overrides.hasHoverBg && "hover:bg-accent/[0.06]",
          "hover:border-accent/50",
          !overrides.hasText && !overrides.hasHoverText && "hover:text-accent-dark",
        ];
        return parts.filter(Boolean).join(" ");
      }
      case "ghost":
        return [
          overrides.hasText ? null : "text-accent",
          "underline underline-offset-2",
          overrides.hasHoverText || overrides.hasText
            ? null
            : "hover:text-accent-dark",
        ]
          .filter(Boolean)
          .join(" ");
      case "nav":
        return [
          overrides.hasBg ? null : "bg-accent-dark",
          overrides.hasText ? null : "text-white",
          "border border-transparent",
          overrides.hasHoverBg ? null : "hover:bg-accent-dark/92",
        ]
          .filter(Boolean)
          .join(" ");
      case "primary":
      default:
        return [
          overrides.hasBg ? null : "bg-accent-dark",
          overrides.hasText ? null : "text-white",
          "border border-transparent",
          overrides.hasHoverBg ? null : "hover:bg-accent-dark/92",
        ]
          .filter(Boolean)
          .join(" ");
    }
  }

  const isGhost = variant === "ghost";

  const classes = cx(
    focusRing,
    isGhost
      ? cx("inline-flex items-center justify-center gap-2", transitionBtn)
      : cx(
          solidLayout,
          hoverLift,
          transitionBtn,
          typographyAndSize(size, variant),
          variantColorClasses(variant),
        ),
    isGhost && typographyAndSize(size, variant),
    isGhost && variantColorClasses(variant),
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
