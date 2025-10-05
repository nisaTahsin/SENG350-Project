import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { AuthProvider } from "../src/contexts/AuthContext";

function Dummy() {
  return <div>Private Page</div>;
}

describe("ProtectedRoute", () => {
  it("blocks unauthenticated user", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/private"]}>
          <Routes>
            <Route
              path="/private"
              element={<ProtectedRoute element={<Dummy />} />}
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
