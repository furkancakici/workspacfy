import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layout/app.layout";
import BaseLayout from "@/layout/base.layout";
import NotFound from "@/page/errors/NotFound";
import ProtectedRoute from "./protected.route";
import AuthRoute from "./auth.route";
import {
  authenticationRoutePaths,
  baseRoutePaths,
  protectedRoutePaths,
} from "./common/routes";

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <NotFound />,
    children: [
      // Public routes (baseRoutePaths)
      ...baseRoutePaths.map((r) => ({
        path: r.path,
        element: <Suspense fallback={<div />}>{r.element}</Suspense>,
      })),

      // Auth routes with guard
      {
        element: <AuthRoute />,
        children: [
          ...authenticationRoutePaths.map((r) => ({
            path: r.path, // ör: /login, /register
            element: <Suspense fallback={<div />}>{r.element}</Suspense>,
          })),
        ],
      },
    ],
  },

  // Protected subtree
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          ...protectedRoutePaths.map((r) => ({
            path: r.path, // ör: /, /workspace/:id, /projects
            element: <Suspense fallback={<div />}>{r.element}</Suspense>,
          })),
        ],
      },
    ],
  },

  // Catch-all
  { path: "*", element: <NotFound /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
