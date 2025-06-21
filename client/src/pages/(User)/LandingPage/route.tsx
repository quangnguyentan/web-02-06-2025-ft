import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const LandingPage = lazy(() => import("./index"));
const LandingRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/landing",
    element: (
      <Suspense
        fallback={
          <div id="load">
            <div>G</div>
            <div>N</div>
            <div>I</div>
            <div>D</div>
            <div>A</div>
            <div>O</div>
            <div>L</div>
          </div>
        }
      >
        <LandingPage />
      </Suspense>
    ),
  },
];
export default LandingRoutes;
