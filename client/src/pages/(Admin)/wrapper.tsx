import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("./index"));

export default function HomePageWrapper() {
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
      <HomePage />
    </Suspense>
  );
}
