"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { authStorage } from "./auth-storage";
import { getRoleDashboard } from "./role-redirect";
import type { User } from "@/types/auth";

export type RoleName = "customer" | "vendor" | "support" | "admin";

type UseAuthGuardOptions = {
  allowedRoles?: RoleName[];
};

type UseAuthGuardResult = {
  user: User | null;
  isLoading: boolean;
  isAuthorized: boolean;
};

export function useAuthGuard(
  options?: UseAuthGuardOptions,
): UseAuthGuardResult {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  /*
   * Convert the roles array into a stable string.
   *
   * This prevents the effect from running repeatedly when
   * allowedRoles is passed as a new array on every render.
   */
  const allowedRolesKey = useMemo(
    () => options?.allowedRoles?.join("|") ?? "",
    [options?.allowedRoles],
  );

  useEffect(() => {
    const authenticatedUser = authStorage.getUser();

    /*
     * No authenticated user
     */
    if (!authenticatedUser) {
      setUser(null);
      setIsAuthorized(false);
      setIsLoading(false);

      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

      if (pathname !== "/login") {
        router.replace(loginUrl);
      }

      return;
    }

    setUser(authenticatedUser);

    /*
     * Get user's role
     */
    const role = authenticatedUser.role?.name?.toLowerCase() as
      | RoleName
      | undefined;

    /*
     * Check role authorization
     */
    const allowedRoles = allowedRolesKey
      ? (allowedRolesKey.split("|") as RoleName[])
      : undefined;

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      setIsAuthorized(false);
      setIsLoading(false);

      const dashboard = getRoleDashboard(authenticatedUser);

      if (pathname !== dashboard) {
        router.replace(dashboard);
      }

      return;
    }

    /*
     * Authorized
     */
    setIsAuthorized(true);
    setIsLoading(false);
  }, [pathname, router, allowedRolesKey]);

  return {
    user,
    isLoading,
    isAuthorized,
  };
}
