import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveStyle(css: Record<string, unknown> | string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toContainElement(element: HTMLElement | null): R;
      toHaveValue(value: string | string[] | number): R;
    }
  }
}
