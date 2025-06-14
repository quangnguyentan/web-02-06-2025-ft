import axios, { AxiosHeaders } from "axios";
import { apiRefreshToken } from "./services/auth.services";
import { logout } from "./stores/actions/authAction";
import toast from "react-hot-toast";
import reduxStore from "@/store";
import { navigate } from "./lib/navigate";

const { store } = reduxStore();
const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});
instance.interceptors.request.use(
    function (config) {
        const token =
            window.localStorage.getItem("persist:auth") &&
            JSON.parse(window.localStorage.getItem("persist:auth") as string)?.token.slice(
                1,
                -1
            );
        if (token) {
            if (config.headers instanceof AxiosHeaders) {
                config.headers.set('authorization', `Bearer ${token}`);
            } else {
                config.headers = new AxiosHeaders({
                    authorization: `Bearer ${token}`,
                });
            }
        }

        return config;
    },
    function (error) {
        console.log(error);
        return Promise.reject(error);
    }
);
// Handle response
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (originalRequest.url?.includes('/auth/refreshToken')) {
            return Promise.reject(error);
        }

        if (error?.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // tránh lặp vô hạn
            try {
                const refreshResponse = await apiRefreshToken(); // Gọi API refresh token

                const newAccessToken = refreshResponse?.data?.newAccessToken;
                if (newAccessToken) {
                    // Save new access token vào localStorage
                    const persistAuth = window.localStorage.getItem("persist:auth");
                    if (persistAuth) {
                        const authData = JSON.parse(persistAuth);
                        authData.token = JSON.stringify(newAccessToken);
                        window.localStorage.setItem("persist:auth", JSON.stringify(authData));

                    }

                    // Cập nhật Authorization header cho request cũ
                    if (originalRequest.headers instanceof AxiosHeaders) {
                        originalRequest.headers.set("authorization", `Bearer ${newAccessToken}`);
                    } else {
                        originalRequest.headers = new AxiosHeaders({
                            authorization: `Bearer ${newAccessToken}`,
                        });
                    }

                    // Retry request cũ với token mới
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token expired:", refreshError);

                // 1. Xóa localStorage auth
                window.localStorage.removeItem("persist:auth");

                // 2. Dispatch action logout để Redux clean state
                store.dispatch(logout());

                // 3. Redirect về trang login
                // window.location.href = "/auth";
                const pathname = location.pathname;
                const isAdminPath = pathname.startsWith("/admin");
                navigate(isAdminPath ? "/admin/auth" : "/auth");

                // 4. Hiện toast
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                return Promise.reject(refreshError);
            }
        }
        if (error.response?.status === 401 && originalRequest._retry) {
            // Đã retry rồi mà vẫn lỗi => có thể logout
            console.error('Session expired. Please login again.');
        } else {
            console.error('API error:', error);
        }

        return Promise.reject(error);
    }
);
// instance.interceptors.response.use(
//     function (response) {
//         // Any status code that lie within the range of 2xx cause this function to trigger
//         // Do something with response data
//         return response;
//     },
//     function (error) {
//         // Any status codes that falls outside the range of 2xx cause this function to trigger
//         // Do something with response error
//         return error.response;
//     }
// );
export default instance;
