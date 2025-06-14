import { RouteObject } from "react-router-dom";
import HomePageWrapper from "./wrapper";
import "./index.css";
const homeRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/",
    element: <HomePageWrapper />,
    index: true,
    role: ["ADMIN"],
  },
];
export default homeRoutes;
