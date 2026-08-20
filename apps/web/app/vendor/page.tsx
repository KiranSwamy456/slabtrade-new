"use client";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import LogoutButton from "@/components/auth/LogoutButton";

export default function VendorPage() {
  const { user, isLoading, isAuthorized } = useAuthGuard({
    allowedRoles: ["vendor"],
  });

  if (isLoading) {
    return (
      <main style={{ padding: 40 }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAuthorized || !user) {
    return null;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Vendor Dashboard</h1>

      <p>Welcome, {user.firstName}</p>

      <p>
        You are logged in as <strong>{user.role?.name}</strong>.
      </p>

      <LogoutButton />
    </main>
  );
}
