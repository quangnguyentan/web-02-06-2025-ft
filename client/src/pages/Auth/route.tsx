import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const AuthPage = lazy(() => import("./index"));
const authRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/admin/auth",
    element: <AuthPage />, // dùng chung AuthPage
    index: true,
  },
  {
    path: "/auth",
    element: <AuthPage />, // dùng chung nhưng phân biệt bằng pathname
    index: true,
  },
];
export default authRoutes;
