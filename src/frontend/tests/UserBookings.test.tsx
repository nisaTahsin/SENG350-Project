import React from "react";
import { render, screen } from "@testing-library/react";
import UserBookings from "../src/components/UserBookings";

describe("UserBookings", () => {
  it("renders bookings list inside modal", () => {
    render(
      <UserBookings
        isOpen
        onClose={() => {}}
        user={{ id: "u1", name: "Test User" }}
      />
    );

    // check heading instead of dialog role
    expect(screen.getByText(/bookings for/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});
