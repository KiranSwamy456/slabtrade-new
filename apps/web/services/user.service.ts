import { apiRequest } from "@/lib/api";

export type CreateUserRequest = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  role: "Customer" | "Vendor" | "Support" | "Admin";
};

export type CreatedUser = {
  id: string;
  firstName: string;
  lastName?: string | null;
  fullName?: string | null;
  email: string;
  phone?: string | null;
  isActive: boolean;
  isVerified: boolean;
  role?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  createdAt: string;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  data: CreatedUser;
};

export type UserListItem = {
  id: string;
  firstName: string;
  lastName?: string | null;
  fullName?: string | null;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  isActive: boolean;
  isVerified: boolean;
  role?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type ListUsersResponse = {
  success: boolean;
  message: string;
  data: UserListItem[];
};

export type UpdateUserStatusResponse = {
  success: boolean;
  message: string;
  data: UserListItem;
};

export const userService = {
  async createUser(
    data: CreateUserRequest,
    accessToken: string,
  ): Promise<CreateUserResponse> {
    return apiRequest<CreateUserResponse>("/users", {
      method: "POST",
      token: accessToken,
      body: JSON.stringify(data),
    });
  },

  async listUsers(accessToken: string): Promise<ListUsersResponse> {
    return apiRequest<ListUsersResponse>("/users", {
      method: "GET",
      token: accessToken,
    });
  },

  async updateUserStatus(
    id: string,
    isActive: boolean,
    accessToken: string,
  ): Promise<UpdateUserStatusResponse> {
    return apiRequest<UpdateUserStatusResponse>(`/users/${id}/status`, {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify({ isActive }),
    });
  },
};
