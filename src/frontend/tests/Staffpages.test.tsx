import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StaffBrowseAvailability from "../src/components/pages/StaffBrowseAvailability";
import StaffMyBookings from "../src/components/pages/StaffMyBookings";
import StaffBookingHistory from "../src/components/pages/StaffBookingHistory";

describe("Staff Pages", () => {
  it("renders Browse Availability", () => {
    render(
      <MemoryRouter>
        <StaffBrowseAvailability />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /browse/i })).toBeInTheDocument();
  });

  it("renders My Bookings", () => {
    render(
      <MemoryRouter>
        <StaffMyBookings />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /bookings/i })).toBeInTheDocument();
  });

  it("renders Booking History", () => {
    render(
      <MemoryRouter>
        <StaffBookingHistory />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /history/i })).toBeInTheDocument();
  });
});
