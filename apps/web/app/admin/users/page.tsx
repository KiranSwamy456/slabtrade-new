"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { userService, type UserListItem } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersDataTable } from "@/components/dashboard/UsersDataTable";

export default function AdminUsersPage() {
  const { user } = useAuthGuard({ allowedRoles: ["admin"] });

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      return;
    }

    userService
      .listUsers(accessToken)
      .then((response) => setUsers(response.data))
      .catch((error) => {
        toast.error("Failed to load users", {
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleStatus = async (target: UserListItem) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please sign in again.",
      });
      return;
    }

    const nextStatus = !target.isActive;

    try {
      const response = await userService.updateUserStatus(
        target.id,
        nextStatus,
        accessToken,
      );

      setUsers((previous) =>
        previous.map((item) =>
          item.id === target.id ? response.data : item,
        ),
      );

      toast.success(
        nextStatus ? "User activated" : "User deactivated",
        {
          description: `${target.firstName} ${target.lastName ?? ""}`.trim(),
        },
      );
    } catch (error) {
      toast.error("Failed to update status", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  const handleEdit = (target: UserListItem) => {
    toast.info("Coming soon", {
      description: `Editing ${target.firstName} isn't available yet.`,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Users</h2>
        <p className="mt-1 text-slate-500">
          Manage Slab Trade users and their roles.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="space-y-3 py-6">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : (
        <UsersDataTable
          users={users}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          headerActions={
            <Button asChild size="sm">
              <Link href="/admin/users/create">+ Create User</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
