import api from "./axios";
import { refresh } from "./auth/auth.api";

import {
  selectAccessToken,
  setCredentials,
  logout,
} from "@/store/auth";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(accessToken);
    }
  });

  failedQueue = [];
};

let requestInterceptorId = null;
let responseInterceptorId = null;

export function setupInterceptors(store) {
  // Prevent duplicate interceptors (React StrictMode)
  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId);
  }

  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
  }

  /*
  |--------------------------------------------------------------------------
  | Request Interceptor
  |--------------------------------------------------------------------------
  */

  requestInterceptorId = api.interceptors.request.use(
    (config) => {
      const accessToken = selectAccessToken(
        store.getState()
      );

      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /*
  |--------------------------------------------------------------------------
  | Response Interceptor
  |--------------------------------------------------------------------------
  */

  responseInterceptorId = api.interceptors.response.use(
    (response) => response,

    async (error) => {
      if (!error.response || !error.config) {
        return Promise.reject(error);
      }

      const originalRequest = error.config;

      const AUTH_ENDPOINTS = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
      ];

      if (
        AUTH_ENDPOINTS.some((endpoint) =>
          originalRequest.url?.includes(endpoint)
        )
      ) {
        return Promise.reject(error);
      }

      if (
        error.response.status !== 401 ||
        originalRequest.__isRetryRequest
      ) {
        return Promise.reject(error);
      }

      originalRequest.__isRetryRequest = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((accessToken) => {
            originalRequest.headers =
              originalRequest.headers ?? {};

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
          })
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        const { data } = await refresh();

        const {
          user,
          accessToken,
        } = data.data;

        store.dispatch(
          setCredentials({
            user,
            accessToken,
          })
        );

        processQueue(null, accessToken);

        originalRequest.headers =
          originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}