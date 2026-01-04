import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import { Header } from "components";
import { MainList, DetailPage } from "pages";
import { ROUTES } from "constants/routers";
import { ErrorPage } from "pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.index} replace />,
      },
      {
        path: ROUTES.index,
        element: <MainList />,
      },
      {
        path: `${ROUTES.detail.root}`,
        element: <DetailPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);
