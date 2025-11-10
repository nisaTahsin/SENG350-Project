// tests/test-utils.tsx

function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthProvider>
  );
}

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';

type ChildrenProps = { children: React.ReactNode };
type WithRouterProps = ChildrenProps & { initialEntries?: string[] };

export function WithAuthAndRouter({ children, initialEntries = ['/'] }: WithRouterProps) {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </AuthProvider>
  );
}

export function WithAuthOnly({ children }: ChildrenProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
