import { ComponentProps, ComponentType, Suspense } from "react";

import { Loading } from "@mydav/design-system";
import { ErrorPage } from "pages/ErrorPage";
import ErrorBoundary from "../routes/ErrorBoundary";

interface AsyncBoundaryProps {
  rejectedFallback?: ComponentProps<typeof ErrorBoundary>["fallback"];
  pendingFallback?: ComponentProps<typeof Suspense>["fallback"];
}

export default function withAsyncBoundary<
  Props extends Record<string, unknown>,
>(
  WrappedComponent: ComponentType<Props>,
  {
    pendingFallback = <Loading />,
    rejectedFallback = <ErrorPage />,
  }: AsyncBoundaryProps = {},
) {
  return (props: Props) => (
    <ErrorBoundary fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>
        <WrappedComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
