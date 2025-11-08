import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';


export function WithRouter({
  children,
  initialEntries = ['/'],
}: PropsWithChildren<{ initialEntries?: string[] }>) {
  return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
}

export function WithAuthOnly({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function WithAuthAndRouter({
  children,
  initialEntries = ['/'],
}: PropsWithChildren<{ initialEntries?: string[] }>) {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </AuthProvider>
  );
}

/** One-shot renderer with Auth + Router */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { route?: string },
) {
  const route = options?.route ?? '/';
  return render(ui, {
    wrapper: ({ children }) => (
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AuthProvider>
    ),
    ...options,
  });
}

// ALSO export default to survive any default-imports
export default renderWithProviders;

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
