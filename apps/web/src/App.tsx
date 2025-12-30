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

const queryClient = new QueryClient();

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
