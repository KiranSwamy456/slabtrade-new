"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { authStorage } from "./auth-storage";
import { getRoleDashboard } from "./role-redirect";
import type { User } from "@/types/auth";

type RoleName = "customer" | "vendor" | "support" | "admin";

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

  useEffect(() => {
    const authenticatedUser = authStorage.getUser();

    if (!authenticatedUser) {
      setUser(null);
      setIsAuthorized(false);
      setIsLoading(false);

      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);

      return;
    }

    setUser(authenticatedUser);

    const role = authenticatedUser.role?.name?.toLowerCase() as
      | RoleName
      | undefined;

    if (
      options?.allowedRoles &&
      (!role || !options.allowedRoles.includes(role))
    ) {
      setIsAuthorized(false);
      setIsLoading(false);

      router.replace(getRoleDashboard(authenticatedUser));

      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, pathname, options?.allowedRoles]);

  return {
    user,
    isLoading,
    isAuthorized,
  };
}
