import type { User } from "@/types/auth";

const ACCESS_TOKEN_KEY = "slabtrade_access_token";
const REFRESH_TOKEN_KEY = "slabtrade_refresh_token";
const USER_KEY = "slabtrade_user";

export const authStorage = {
  setAuth(data: { accessToken: string; refreshToken: string; user: User }) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);

    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },

  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as User;
    } catch {
      return null;
    }
  },

  clear() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);

    localStorage.removeItem(REFRESH_TOKEN_KEY);

    localStorage.removeItem(USER_KEY);
  },
};
