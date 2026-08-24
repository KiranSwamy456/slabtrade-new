"use client";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { AccountOverviewCard } from "@/components/dashboard/AccountOverviewCard";

export default function VendorPage() {
  const { user } = useAuthGuard({ allowedRoles: ["vendor"] });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome, {user.firstName}
        </h2>
        <p className="mt-1 text-slate-500">
          Here&apos;s an overview of your Slab Trade account.
        </p>
      </div>

      <AccountOverviewCard user={user} />
    </div>
  );
}
