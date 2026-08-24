"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authStorage } from "@/lib/auth/auth-storage";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

export interface DashboardNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  navItems: DashboardNavItem[];
  user: User;
}

function getInitials(user: User) {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || <UserIcon className="size-4" />;
}

export function AppSidebar({ navItems, user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  /*
   * Pick the single most specific nav item whose url matches the current
   * path, so a parent route (e.g. "/admin") doesn't also light up when a
   * more specific sibling route (e.g. "/admin/users") is active.
   */
  const activeUrl = navItems.reduce<string | null>((best, item) => {
    const matches =
      pathname === item.url || pathname.startsWith(`${item.url}/`);

    if (!matches) return best;
    if (best === null || item.url.length > best.length) return item.url;
    return best;
  }, null);

  const handleLogout = () => {
    authStorage.clear();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center justify-center py-2">
          <Image
            src="/images/logo.png"
            alt="Slab Trade"
            width={1743}
            height={743}
            className="h-9 w-auto brightness-0 invert-0 dark:invert-0"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <SidebarGroup>
          {/* <SidebarGroupLabel>{user.role?.name}</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const isActive = item.url === activeUrl;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        isActive &&
                          "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 [&_svg]:text-blue-600",
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-7 rounded-lg">
                <AvatarFallback className="rounded-lg bg-blue-600 text-xs text-white">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-blue-600 text-xs text-white">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
