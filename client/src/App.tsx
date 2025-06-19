import { Route, RouteObject, Routes, useNavigate } from "react-router-dom";
import routes from "./pages/routes";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Toaster } from "react-hot-toast";
import { getCurrent } from "./stores/actions/userAction";
import { AppDispatch } from "./main";
import { setNavigate } from "./lib/navigate";
function App() {
  const { isLoggedIn, current } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
      else {
        // navigate("/");
        // const publicPaths = [
        //   /^\/auth$/,
        //   /^\/forgot-password$/,
        //   /^\/reset-password\/[^/]+$/,
        // ];
        // const isPublicPath = publicPaths.some((pattern) =>
        //   pattern.test(location.pathname)
        // );
        // if (!isPublicPath) {
        //   navigate("/");
        // }
      }
    }, 1000);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn, navigate]);
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  type AppRouteObject = RouteObject & {
    role?: string[];
  };
  const filteredRoutes = (routes as AppRouteObject[]).filter((route) => {
    if (!route.role) return true;
    return route.role.includes(current as string);
  });
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Hiển thị thông báo hoặc thực hiện hành động trước khi reload
  //     console.log("Trang đang được reload hoặc đóng");
  //     // Nếu muốn hiển thị xác nhận trước khi reload
  //     event.preventDefault();
  //     event.returnValue = ""; // Hiển thị hộp thoại xác nhận (tùy trình duyệt)
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Cleanup listener khi component unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

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
      <Routes>
        {filteredRoutes.map((route) => {
          const isAdminRoute = route.role?.includes("ADMIN");
          if (isAdminRoute) {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<div className="admin-wrapper">{route.element}</div>}
              />
            );
          }

          return (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((childRoute) => (
                <Route
                  key={childRoute.path}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          );
        })}
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "0.9rem",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
    </Suspense>
  );
}

export default App;
