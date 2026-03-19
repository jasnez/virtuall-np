import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";

type FormValues = {
  email: string;
  message: string;
  category: string;
};

function TestForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { email: "", message: "", category: "a" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        placeholder="you@example.com"
        type="email"
        {...register("email")}
      />

      <Textarea
        label="Message"
        placeholder="Hello"
        {...register("message")}
      />

      <Select label="Category" {...register("category")}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>

      <button type="submit">Submit</button>
    </form>
  );
}

describe("Form fields (react-hook-form integration)", () => {
  jest.setTimeout(20000);
  it("Input, Textarea and Select work with react-hook-form register()", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Message"), "Hello there");
    await user.selectOptions(screen.getByLabelText("Category"), "b");

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { email: "test@example.com", message: "Hello there", category: "b" },
      expect.anything(),
    );
  });
});

describe("Form fields (label, required, error a11y + styles)", () => {
  it("renders label with required indicator via required attribute", () => {
    render(<Input label="Name" name="name" required />);
    const input = screen.getByLabelText("Name");
    expect(input).toBeRequired();
  });

  it("shows error message and wires aria-describedby for Input", () => {
    render(<Input label="Email" name="email" error="Required" />);
    const input = screen.getByLabelText("Email");
    const err = screen.getByText("Required");
    expect(input).toHaveAttribute("aria-describedby", err.getAttribute("id"));
    expect(input).toHaveClass("border-error");
  });

  it("shows error message and wires aria-describedby for Textarea", () => {
    render(<Textarea label="Message" name="message" error="Too short" />);
    const textarea = screen.getByLabelText("Message");
    const err = screen.getByText("Too short");
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      err.getAttribute("id"),
    );
    expect(textarea).toHaveClass("border-error");
  });

  it("shows error message and wires aria-describedby for Select", () => {
    render(
      <Select label="Category" name="category" error="Pick one">
        <option value="a">A</option>
      </Select>,
    );
    const select = screen.getByLabelText("Category");
    const err = screen.getByText("Pick one");
    expect(select).toHaveAttribute("aria-describedby", err.getAttribute("id"));
    expect(select).toHaveClass("border-error");
  });
});

