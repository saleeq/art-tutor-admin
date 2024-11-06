// src/utils/apiClient.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import { API_BASE_URL } from "@/config";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Subscribe to token refresh
  const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  // Execute subscribers with new token
  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
  };

  // Add auth header
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("serverToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle response errors
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;

      // If error is not 401 or request already retried, reject
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get current Firebase user and refresh token
        const user = await import("@/utils/firebase").then(
          (m) => m.auth.currentUser
        );
        if (!user) {
          throw new Error("No user found");
        }

        const firebaseToken = await user.getIdToken(true); // Force refresh

        // Get new server token
        const response = await axios.post(
          `${API_BASE_URL}users/user-auth/login/`,
          {
            firebase_token: firebaseToken,
          }
        );

        const newToken = response.data.access_token;
        localStorage.setItem("serverToken", newToken);

        // Update all queued requests with new token
        onTokenRefreshed(newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("serverToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return apiClient;
};

export default createApiClient;