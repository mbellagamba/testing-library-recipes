import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./login";

describe("Login", () => {
  /**
   * DISCLAIMER: This test file DOES NOT represent a valid test for a login form.
   * It needs to show how to use testing library queries.
   */

  test("Show how to use each Testing Library selector", () => {
    render(<Login />);

    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeInTheDocument();

    const username = screen.getByLabelText("Username");
    expect(username).toBeInTheDocument();
    const password = screen.getByLabelText("Password");
    expect(password).toBeInTheDocument();

    const usernameByPlaceholderText = screen.getByPlaceholderText(
      "Username or email"
    );
    expect(usernameByPlaceholderText).toBeInTheDocument();

    const hint = screen.getByText("Sign in to your account");
    expect(hint).toBeInTheDocument();

    const value = "user@example.com";
    userEvent.type(username, value);
    const usernameByDisplayValue = screen.getByDisplayValue(value);
    expect(usernameByDisplayValue).toBeInTheDocument();

    const logo = screen.getByAltText("octopus");
    expect(logo).toBeInTheDocument();

    const logoByTitle = screen.getByTitle("octopus title");
    expect(logoByTitle).toBeInTheDocument();

    const form = screen.getByTestId("loginform");
    expect(form).toBeInTheDocument();
  });

  test("Show how to get multiple elements", () => {
    render(<Login />);

    const textInputs = screen.getAllByRole("img");
    expect(textInputs).toHaveLength(3);

    expect(textInputs[0]).toHaveAttribute("alt", "octopus");
    expect(textInputs[1]).toHaveAttribute("alt", "alembic");
    expect(textInputs[2]).toHaveAttribute("alt", "test tube");
  });

  test("Show how to use query methods", () => {
    render(<Login />);

    const checkbox = screen.queryByRole("checkbox");
    expect(checkbox).not.toBeInTheDocument();
  });

  test("Show how to use find methods", async () => {
    render(<Login />);

    userEvent.type(screen.getByLabelText("Username"), "test@example.com");
    userEvent.type(screen.getByLabelText("Password"), "12345678");
    userEvent.click(screen.getByRole("button"));

    const messageAlert = await screen.findByRole("alert");
    expect(messageAlert).toBeInTheDocument();
  });
});
