import type { User } from "@/types/auth";

export function getRoleDashboard(user: User): string {
  const role = user.role?.name?.toLowerCase();

  switch (role) {
    case "customer":
      return "/customer";

    case "vendor":
      return "/vendor";

    case "support":
      return "/support";

    case "admin":
      return "/admin";

    default:
      return "/login";
  }
}
