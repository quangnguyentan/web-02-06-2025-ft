import { Suspense, lazy } from "react";
const PublicPage = lazy(() => import("./index"));
import "./index.css";
import { Loader } from "@/components/layout/Loader";
export default function PublicPageWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <PublicPage />
    </Suspense>
  );
}
