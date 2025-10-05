import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPermissionsTable from "../src/components/AdminPermissionsTable";

describe("AdminPermissionsTable", () => {
  it("edits a user's role", async () => {
    render(<AdminPermissionsTable />);
    const row = screen.getAllByRole("row")[1];
    await userEvent.click(
      within(row).getByRole("button", { name: /change permissions/i })
    );

    // select dropdown by generic combobox role (no name)
    const select = await screen.findByRole("combobox");
    await userEvent.selectOptions(select, "Admin");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(within(row).getByText(/admin/i)).toBeInTheDocument();
  });
});
