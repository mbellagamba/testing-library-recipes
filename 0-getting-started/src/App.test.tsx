import { render, screen } from "@testing-library/react";
import App from "./App";

it("Should contain a link", () => {
  render(<App />);
  const linkElement = screen.getByRole("link", { name: /mirco bellagamba/i });
  expect(linkElement).toBeInTheDocument();
});
