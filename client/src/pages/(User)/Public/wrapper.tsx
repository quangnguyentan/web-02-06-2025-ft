import { Suspense, lazy } from "react";
const PublicPage = lazy(() => import("./index"));
import "./index.css";
export default function PublicPageWrapper() {
  return (
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
      <PublicPage />
    </Suspense>
  );
}
