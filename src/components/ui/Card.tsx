import React from "react";

export type CardPadding = "sm" | "md" | "lg";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: CardPadding;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const paddingMap: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  hover = true,
  padding = "md",
}: Props) {
  return (
    <div
      data-testid="card"
      className={cx(
        "bg-white rounded-xl border border-gray-200/80",
        paddingMap[padding],
        hover &&
          "hover:border-gray-300/80 hover:bg-gray-50/50 transition-colors duration-200 ease-out",
        className,
      )}
    >
      {children}
    </div>
  );
}

