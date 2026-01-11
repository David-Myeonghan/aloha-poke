import { ComponentProps, ComponentType, Suspense } from "react";
import { useLocation } from "react-router-dom";

import { Loading } from "@mydav/design-system";
import { ErrorPage } from "pages/ErrorPage";
import ErrorBoundary from "../routes/ErrorBoundary";

interface AsyncBoundaryProps {
  rejectedFallback?: ComponentProps<typeof ErrorBoundary>["fallback"];
  pendingFallback?: ComponentProps<typeof Suspense>["fallback"];
}

const CenteredLoading = (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Loading />
  </div>
);

export default function withAsyncBoundary<
  Props extends Record<string, unknown>,
>(
  WrappedComponent: ComponentType<Props>,
  {
    pendingFallback = CenteredLoading,
    rejectedFallback = <ErrorPage />,
  }: AsyncBoundaryProps = {},
) {
  return (props: Props) => {
    const location = useLocation();

    // 관심사 분리
    return (
      // 에러 UI
      <ErrorBoundary fallback={rejectedFallback} resetKeys={[location.search]}>
        {/* 로딩 UI */}
        <Suspense fallback={pendingFallback}>
          {/* 비즈니스 로직 (+ 데이터 fetching) */}
          <WrappedComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
