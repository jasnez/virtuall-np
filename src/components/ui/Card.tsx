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
        "bg-white rounded-xl shadow-sm border border-gray-100",
        paddingMap[padding],
        hover && "hover:shadow-md hover:-translate-y-1 transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

