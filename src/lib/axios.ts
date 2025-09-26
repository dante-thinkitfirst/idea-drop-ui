import axios from "axios";
import { getStoredAccessToken } from "@/lib/authToken";
import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_PRODUCTION_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//create an interceptor to add the access token to the request headers because we are unable to set the access token in the context
//unable to use hooks in something that is not a react component
//attach token on refresh request
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//refresh token after it expires (1m) attaches the new token on refresh request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      // console.log("Request: ", originalRequest.headers);
      originalRequest._retry = true;

      try {
        const { accessToken: newToken } = await refreshAccessToken();
        setStoredAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error("Error refreshing token: ", error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
