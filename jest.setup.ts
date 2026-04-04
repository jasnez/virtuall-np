import "@testing-library/jest-dom";

// @marsidev/react-turnstile ships ESM-only; Jest needs a stub so modules that import it can load.
jest.mock("@marsidev/react-turnstile", () => {
  const React = require("react") as typeof import("react");
  return {
    Turnstile: React.forwardRef(function MockTurnstile(
      _props: unknown,
      ref: React.Ref<{ reset: () => void } | null>,
    ) {
      React.useImperativeHandle(ref, () => ({
        reset: jest.fn(),
      }));
      return null;
    }),
  };
});

