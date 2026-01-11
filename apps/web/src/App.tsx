import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorPage } from "pages/ErrorPage";
import { router } from "utils/routes/router";
import ErrorBoundary from "utils/routes/ErrorBoundary";
import IndexedDBSingleton, {
  createDB,
  RECENT_VIEW,
} from "utils/IndexedDB/IndexedDBSingleton";

// 4xx 번대 결과(클라이언트 오류)는 재시도 안하도록.
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as { response?: Response }).response?.status;
        if (status && HTTP_STATUS_TO_NOT_RETRY.includes(status)) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
    },
  },
});

IndexedDBSingleton.openDB(RECENT_VIEW, 1, createDB).catch((err) =>
  console.log("err: ", err),
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
