import React from "react";

import {
  cardChrome,
  cardHover,
  cardPadding,
} from "@/lib/card-surface";

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
        cardChrome,
        cardPadding[padding],
        hover && cardHover,
        className,
      )}
    >
      {children}
    </div>
  );
}

