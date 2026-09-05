import axios, { type AxiosInstance } from "axios";

import globalConfig from "@/config/globalConfig";

const ACCESS_TOKEN_KEY = "streaming-platform.access-token";

export const apiClient: AxiosInstance = axios.create({
  baseURL: globalConfig.apiBaseUrl,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

export function storeAccessToken(accessToken: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
}

export function clearAccessToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

export default apiClient;
