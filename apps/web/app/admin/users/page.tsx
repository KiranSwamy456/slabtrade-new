"use client";

import Link from "next/link";

import { useAuthGuard } from "@/lib/auth/auth-guard";

export default function CreateUserPage() {
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
      <Link href="/admin/users">← Back to Users</Link>

      <h1 style={{ marginTop: 20 }}>Create User</h1>

      <p>Create a Customer, Vendor, Support, or Admin account.</p>
    </main>
  );
}
