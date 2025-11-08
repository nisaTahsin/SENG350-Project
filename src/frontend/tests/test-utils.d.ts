import React, { PropsWithChildren } from 'react';
import { RenderOptions } from '@testing-library/react';
export declare function WithRouter({ children, initialEntries, }: PropsWithChildren<{
    initialEntries?: string[];
}>): import("react/jsx-runtime").JSX.Element;
export declare function WithAuthOnly({ children }: PropsWithChildren): import("react/jsx-runtime").JSX.Element;
export declare function WithAuthAndRouter({ children, initialEntries, }: PropsWithChildren<{
    initialEntries?: string[];
}>): import("react/jsx-runtime").JSX.Element;
/** One-shot renderer with Auth + Router */
export declare function renderWithProviders(ui: React.ReactElement, options?: RenderOptions & {
    route?: string;
}): import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
export default renderWithProviders;
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
//# sourceMappingURL=test-utils.d.ts.map