"use client";

import Link from "next/link";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import LogoutButton from "@/components/auth/LogoutButton";

export default function AdminUsersPage() {
  const { user, isLoading, isAuthorized } = useAuthGuard({
    allowedRoles: ["admin"],
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1>Users</h1>

          <p>Manage Granite Marketplace users and their roles.</p>
        </div>

        <Link href="/admin/users/create">+ Create User</Link>
      </div>

      <div>
        <p>User management will appear here.</p>
      </div>

      <LogoutButton />
    </main>
  );
}
