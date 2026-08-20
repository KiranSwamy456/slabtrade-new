"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage } from "@/lib/auth/auth-storage";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    authStorage.clear();

    toast.success("Logged out successfully");

    router.replace("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
