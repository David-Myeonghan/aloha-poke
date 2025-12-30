import React, { ComponentProps, ComponentType, Suspense } from "react";

import ErrorBoundary from "../routes/ErrorBoundary";

interface AsyncBoundaryProps {
  rejectedFallback: ComponentProps<typeof ErrorBoundary>["fallback"];
  pendingFallback: ComponentProps<typeof Suspense>["fallback"];
}
export default function withAsyncBoundary<Props = Record<string, never>>(
  WrappedComponent: ComponentType<Props>,
  { pendingFallback, rejectedFallback }: AsyncBoundaryProps,
) {
  return (props: Props) => {
    return (
      <ErrorBoundary fallback={rejectedFallback}>
        <Suspense fallback={pendingFallback}>
          <WrappedComponent {...(props as any)} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
