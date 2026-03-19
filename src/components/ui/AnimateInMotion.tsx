"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

export type AnimateDirection = "up" | "down" | "left" | "right";

export type AnimateInMotionProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: AnimateDirection;
  className?: string;
  // `keyof typeof motion` can technically include `symbol`; React.createElement only accepts a string/tag/component.
  as?: keyof typeof motion & string;
  // Allow passing through attributes like `data-testid` to the underlying motion element.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function offsetForDirection(direction: AnimateDirection) {
  switch (direction) {
    case "down":
      return { x: 0, y: -20 };
    case "left":
      return { x: -20, y: 0 };
    case "right":
      return { x: 20, y: 0 };
    case "up":
    default:
      return { x: 0, y: 20 };
  }
}

export function AnimateInMotion({
  children,
  delay = 0,
  direction = "up",
  className,
  as = "div",
  ...rest
}: AnimateInMotionProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // `motion[as]` has a very complex prop type. Casting to `React.ElementType`
  // keeps TypeScript from exploding on JSX inference while preserving runtime behavior.
  const MotionTag = (motion[as] ?? motion.div) as unknown as React.ElementType;

  const offset = offsetForDirection(direction);

  return (
    <MotionTag
      ref={ref}
      className={cx(className)}
      initial={{ opacity: 1, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 1, ...offset }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

