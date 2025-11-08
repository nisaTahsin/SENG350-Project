// tests/genericPage.test.tsx
import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";

import { GenericPage } from '../src/components/GenericPage';



describe("GenericPage", () => {
  it("renders a generic page title", () => {
    renderWithProviders(<GenericPage title="Hello" />);
    expect(screen.getByRole("heading", { name: /hello/i })).toBeInTheDocument();
  });
});

