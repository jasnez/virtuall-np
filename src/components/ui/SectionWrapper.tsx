import React from "react";

import { PAGE_CONTAINER_X } from "@/lib/page-layout";

export type SectionBgColor = "white" | "alt" | "navy";
export type SectionPadding = "sm" | "md" | "lg";

type Props = {
  children: React.ReactNode;
  className?: string;
  bgColor?: SectionBgColor;
  id?: string;
  padding?: SectionPadding;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const bgMap: Record<SectionBgColor, string> = {
  white: "#FFF",
  alt: "#F5F5F0",
  navy: "#1B3A5C",
};

const paddingMap: Record<SectionPadding, string> = {
  sm: "py-16",
  md: "py-20",
  lg: "py-20",
};

export function SectionWrapper({
  children,
  className,
  bgColor = "white",
  id,
  padding = "lg",
}: Props) {
  return (
    <section
      id={id}
      data-testid="section-wrapper"
      className={cx(paddingMap[padding], className)}
      style={{ backgroundColor: bgMap[bgColor] }}
    >
      <div
        data-testid="section-inner"
        className={PAGE_CONTAINER_X}
      >
        {children}
      </div>
    </section>
  );
}

