import React from "react";
import { render, screen } from "@testing-library/react";

const mockUseInView = jest.fn<boolean, any>();

jest.mock("next/dynamic", () => {
  return (loader: any) => {
    // In tests, avoid async/dynamic loading; render the real implementation directly.
    // `loader` is ignored intentionally.
    // eslint-disable-next-line global-require
    const mod = require("./AnimateInMotion");
    return mod.AnimateInMotion;
  };
});

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    useInView: (...args: any[]) => mockUseInView(...args),
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            transition,
            className,
            ...rest
          }: any,
          ref: any,
        ) => {
          return (
            <div
              ref={ref}
              className={className}
              data-testid="motion-div"
              data-initial={JSON.stringify(initial)}
              data-animate={JSON.stringify(animate)}
              data-transition={JSON.stringify(transition)}
              {...rest}
            >
              {children}
            </div>
          );
        },
      ),
    },
  };
});

import { AnimateIn, StaggerChildren } from "./AnimateIn";

describe("AnimateIn", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
  });

  it("uses useInView once:true and margin:-50px", () => {
    mockUseInView.mockReturnValue(false);
    render(<AnimateIn>Hi</AnimateIn>);
    expect(mockUseInView).toHaveBeenCalled();

    const [, options] = mockUseInView.mock.calls[0];
    expect(options).toEqual({ once: true, margin: "-50px" });
  });

  it("initial is opacity 0 and translate based on direction (default up)", () => {
    mockUseInView.mockReturnValue(false);
    render(<AnimateIn>Hi</AnimateIn>);

    const el = screen.getByTestId("motion-div");
    expect(JSON.parse(el.getAttribute("data-initial") ?? "{}")).toEqual({
      opacity: 1,
      x: 0,
      y: 20,
    });
  });

  it("direction left/right uses x translate", () => {
    mockUseInView.mockReturnValue(false);
    const { rerender } = render(<AnimateIn direction="left">A</AnimateIn>);
    expect(
      JSON.parse(screen.getByTestId("motion-div").getAttribute("data-initial")!),
    ).toEqual({ opacity: 1, x: -20, y: 0 });

    rerender(<AnimateIn direction="right">B</AnimateIn>);
    expect(
      JSON.parse(screen.getByTestId("motion-div").getAttribute("data-initial")!),
    ).toEqual({ opacity: 1, x: 20, y: 0 });
  });

  it("direction down uses y translate -20", () => {
    mockUseInView.mockReturnValue(false);
    render(<AnimateIn direction="down">Hi</AnimateIn>);
    expect(
      JSON.parse(screen.getByTestId("motion-div").getAttribute("data-initial")!),
    ).toEqual({ opacity: 1, x: 0, y: -20 });
  });

  it("animates to visible when in view, otherwise stays hidden", () => {
    mockUseInView.mockReturnValue(false);
    const { rerender } = render(<AnimateIn>Off</AnimateIn>);
    expect(
      JSON.parse(screen.getByTestId("motion-div").getAttribute("data-animate")!),
    ).toEqual({ opacity: 1, x: 0, y: 20 });

    mockUseInView.mockReturnValue(true);
    rerender(<AnimateIn>On</AnimateIn>);
    expect(
      JSON.parse(screen.getByTestId("motion-div").getAttribute("data-animate")!),
    ).toEqual({ opacity: 1, x: 0, y: 0 });
  });

  it("uses transition duration 0.6 easeOut and delay (default 0)", () => {
    mockUseInView.mockReturnValue(true);
    const { rerender } = render(<AnimateIn>Hi</AnimateIn>);
    expect(
      JSON.parse(
        screen.getByTestId("motion-div").getAttribute("data-transition")!,
      ),
    ).toEqual({ duration: 0.6, ease: "easeOut", delay: 0 });

    rerender(<AnimateIn delay={0.2}>Hi</AnimateIn>);
    expect(
      JSON.parse(
        screen.getByTestId("motion-div").getAttribute("data-transition")!,
      ),
    ).toEqual({ duration: 0.6, ease: "easeOut", delay: 0.2 });
  });

  it("disableAnimation bypasses framer-motion wrapper", () => {
    render(
      <AnimateIn disableAnimation>
        <div>Bypassed</div>
      </AnimateIn>,
    );

    expect(screen.getByText("Bypassed")).toBeInTheDocument();
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
  });
});

describe("StaggerChildren", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
    mockUseInView.mockReturnValue(true);
  });

  it("wraps each child with incremental delays", () => {
    render(
      <StaggerChildren>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </StaggerChildren>,
    );

    const wrappers = screen.getAllByTestId("motion-div");
    // First motion-div is the StaggerChildren container
    const childWrappers = wrappers.slice(1);

    const delays = childWrappers.map((w) => {
      const transition = JSON.parse(w.getAttribute("data-transition")!);
      return transition.delay;
    });

    expect(delays).toEqual([0, 0.1, 0.2]);
  });
});

