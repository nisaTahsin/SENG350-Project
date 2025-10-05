import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrarAccountManagementTable from "../src/components/RegistrarAccountManagementTable";

describe("RegistrarAccountManagementTable", () => {
  it("filters users and opens the bookings modal", async () => {
    render(<RegistrarAccountManagementTable />);

    const search = screen.getByPlaceholderText(/search users/i);
    await userEvent.type(search, "ali");

    const rows = screen.getAllByRole("row");
    const firstRow = rows[1];
    const viewBtn = within(firstRow).getByRole("button", {
      name: /view bookings/i,
    });
    await userEvent.click(viewBtn);

    // Modal heading instead of role="dialog"
    expect(await screen.findByText(/bookings for/i)).toBeInTheDocument();
  });
});
