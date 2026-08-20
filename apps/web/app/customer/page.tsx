"use client";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import LogoutButton from "@/components/auth/LogoutButton";

export default function CustomerPage() {
  const { user, isLoading, isAuthorized } = useAuthGuard({
    allowedRoles: ["customer"],
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
      <h1>Customer Dashboard</h1>

      <p>Welcome, {user.firstName}</p>

      <p>
        You are logged in as <strong>{user.role?.name}</strong>.
      </p>

      <LogoutButton />
    </main>
  );
}
