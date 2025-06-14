import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from "react";
const NotFoundPage = lazy(() => import("./index"));
const notFoundRoutes = [
    {
        path: "*",
        element: _jsx(NotFoundPage, {}),
        role: ["student", "teacher", "admin"],
    },
];
export default notFoundRoutes;
