import { Loader } from "@/components/layout/Loader";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const ResetPasswordPage = lazy(() => import("./index"));
const resetPasswordRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/authen",
    element: (
      <Suspense fallback={<Loader />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
];
export default resetPasswordRoutes;
