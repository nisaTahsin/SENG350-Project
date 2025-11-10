import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminSystemConfigurationTable from "../src/components/pages/admin_pages/admin_components/AdminSystemConfigurationTable";

describe("AdminSystemConfigurationTable", () => {
  it("renders and allows editing a setting", async () => {
    render(<AdminSystemConfigurationTable />);

    // handle multiple matches
    const cells = screen.getAllByText(/default open time/i);
    const row = cells[0].closest("tr")!;
    expect(row).toBeInTheDocument();

    await userEvent.click(within(row).getByRole("button", { name: /edit/i }));

    // confirm modal heading
    expect(await screen.findByText(/edit configuration/i)).toBeInTheDocument();
  });
});
