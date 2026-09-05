import apiClient, { storeAccessToken } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

import type { AuthResponse, LoginPayload, RegisterPayload } from "../types";

async function saveAuthResponse(request: Promise<{ data: ApiResponse<AuthResponse> }>) {
  const response = await request;
  const authResponse = response.data.data;

  if (!authResponse?.accessToken) {
    throw new Error("Backend returned an invalid authentication response.");
  }

  storeAccessToken(authResponse.accessToken);
  return authResponse;
}

export const authService = {
  login(payload: LoginPayload) {
    return saveAuthResponse(apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload));
  },

  register(payload: RegisterPayload) {
    return saveAuthResponse(apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload));
  },
};
