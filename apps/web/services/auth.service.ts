import { apiRequest } from "@/lib/api";

import type {
  AuthResponse,
  LoginRequest,
  RefreshResponse,
  RegisterRequest,
  User,
} from "@/types/auth";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<ApiResponse<AuthResponse>>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<ApiResponse<AuthResponse>>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return response.data;
  },

  async profile(accessToken: string): Promise<User> {
    const response = await apiRequest<ApiResponse<User>>("/auth/profile", {
      method: "GET",
      token: accessToken,
    });

    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiRequest<ApiResponse<RefreshResponse>>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({
          refreshToken,
        }),
      },
    );

    return response.data;
  },

  async logout(refreshToken: string) {
    return apiRequest("/auth/logout", {
      method: "POST",
      body: JSON.stringify({
        refreshToken,
      }),
    });
  },
};
