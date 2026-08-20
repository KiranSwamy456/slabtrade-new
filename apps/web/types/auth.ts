export type Role = {
  id: string;
  name: string;
  description?: string | null;
};

export type User = {
  id: string;
  firstName: string;
  lastName?: string | null;
  fullName?: string | null;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  isActive: boolean;
  isVerified: boolean;
  role?: Role | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone?: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
