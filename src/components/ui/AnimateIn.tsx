"use client";

import React from "react";
import dynamic from "next/dynamic";

import type { AnimateDirection, AnimateInMotionProps } from "./AnimateInMotion";

export type { AnimateDirection };
export type AnimateInProps = AnimateInMotionProps & {
  /**
   * Performance escape hatch:
   * when enabled, we bypass Framer Motion entirely and render children immediately.
   */
  disableAnimation?: boolean;
};

// Always use `next/dynamic`. In tests, `next/dynamic` is mocked to synchronously
// render the real implementation, so we don't need `require()` here.
const AnimateInMotion: React.ComponentType<AnimateInProps> = dynamic(
  () => import("./AnimateInMotion").then((mod) => mod.AnimateInMotion),
  {
    ssr: true,
  },
) as unknown as React.ComponentType<AnimateInProps>;

export function AnimateIn(props: AnimateInProps) {
  const {
    children,
    disableAnimation,
    className,
    as = "div",
    ...rest
  } = props;

  if (disableAnimation) {
    return React.createElement(as, { className, ...rest }, children);
  }

  return <AnimateInMotion {...(props as AnimateInMotionProps)} />;
}

type StaggerChildrenProps = {
  children: React.ReactNode;
  className?: string;
  direction?: AnimateDirection;
  delay?: number;
  stagger?: number;
  disableAnimation?: boolean;
};

export function StaggerChildren({
  children,
  className,
  direction = "up",
  delay = 0,
  stagger = 0.1,
  disableAnimation = false,
}: StaggerChildrenProps) {
  const array = React.Children.toArray(children);

  return (
    <AnimateIn
      className={className}
      direction={direction}
      delay={delay}
      disableAnimation={disableAnimation}
    >
      {array.map((child, idx) => (
        <AnimateIn
          key={idx}
          direction={direction}
          delay={delay + idx * stagger}
          disableAnimation={disableAnimation}
        >
          {child}
        </AnimateIn>
      ))}
    </AnimateIn>
  );
}

