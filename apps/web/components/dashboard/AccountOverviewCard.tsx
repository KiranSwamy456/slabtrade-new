import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

const ROLE_COLOR_STYLES = {
  customer: {
    bar: "bg-blue-500",
    avatar: "bg-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
  },
  vendor: {
    bar: "bg-violet-500",
    avatar: "bg-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
  },
  support: {
    bar: "bg-amber-500",
    avatar: "bg-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
  },
  admin: {
    bar: "bg-rose-500",
    avatar: "bg-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
  },
} as const;

interface AccountOverviewCardProps {
  user: User;
}

export function AccountOverviewCard({ user }: AccountOverviewCardProps) {
  const roleKey = (user.role?.name?.toLowerCase() ??
    "customer") as keyof typeof ROLE_COLOR_STYLES;
  const styles = ROLE_COLOR_STYLES[roleKey] ?? ROLE_COLOR_STYLES.customer;

  const initials =
    ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() ||
    "?";

  return (
    <Card className="relative gap-3 overflow-hidden pt-5">
      <div className={cn("absolute inset-x-0 top-0 h-1", styles.bar)} />

      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white",
              styles.avatar,
            )}
          >
            {initials}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <span
            className={cn(
              "ml-auto rounded-full px-3 py-1 text-xs font-semibold",
              styles.badgeBg,
              styles.badgeText,
            )}
          >
            {user.role?.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
