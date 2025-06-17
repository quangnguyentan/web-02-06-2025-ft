import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import PublicPageWrapper from "./wrapper";
const HomePage = lazy(() => import("../Home/index"));
const SportProviderPage = lazy(() => import("../SportProvider/index"));

const LivePage = lazy(() => import("../Live/index"));
const SchedulePageIndex = lazy(() => import("../Schedule/index"));
const ResultPage = lazy(() => import("../Result/index"));
const ReplayPage = lazy(() => import("../Replay/index"));
const XoiLacTVPage = lazy(() => import("../XoiLacTV/index"));
const ReplayStreamPage = lazy(() => import("../ReplayStream/index"));

import "./index.css";

const publicRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/",
    element: <PublicPageWrapper />,
    children: [
      {
        path: "",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <HomePage />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/:slug",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <SportProviderPage />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/truc-tiep/:slug",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <LivePage />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/lich-thi-dau/:slug",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <SchedulePageIndex />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/ket-qua/:slug",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <ResultPage />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/xem-lai/:slug",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <ReplayPage />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/xoi-lac-tv",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <XoiLacTVPage />
          </Suspense>
        ),
        index: true,
      },
      {
        path: "/replay/:slug",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <ReplayStreamPage />
          </Suspense>
        ),
        index: true,
      },
    ],
    // role: ["USER"],
  },
];

export default publicRoutes;
