// src/__tests__/setup-vitest.ts\
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
// JSDOM keeps leaking timers between tests sometimes \'97 clean up DOM after each\
afterEach(() => cleanup());

// Provide basic mocks often used in components\
vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
  matches: false, media: query, onchange: null,
  addListener: vi.fn(), removeListener: vi.fn(),
  addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn()})));
}