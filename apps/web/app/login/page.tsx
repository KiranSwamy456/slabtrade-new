"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { authStorage } from "@/lib/auth/auth-storage";
import { getRoleDashboard } from "@/lib/auth/role-redirect";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const message =
        validation.error.issues[0]?.message ??
        "Please check your login details.";

      setError(message);

      toast.error("Invalid login details", {
        description: message,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await authService.login(validation.data);

      /*
       * Store authentication information.
       */
      authStorage.setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      });

      /*
       * Show successful login message.
       */
      toast.success("Login successful", {
        description: `Welcome back, ${
          response.user.firstName || response.user.email
        }!`,
      });

      /*
       * Determine dashboard based on role.
       */
      const dashboard = getRoleDashboard(response.user);

      /*
       * Redirect to role-specific dashboard.
       */
      router.push(dashboard);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

      setError(message);

      toast.error("Login failed", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-[32px] leading-tight tracking-[-0.8px] text-slate-900 max-[550px]:text-[27px]">
          Welcome back
        </h1>

        <p className="mt-2.5 text-[15px] leading-relaxed text-slate-500">
          Sign in to your Slab Trade account.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs text-slate-700">
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            disabled={loading}
            autoComplete="email"
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs text-slate-700">
              Password
            </Label>

            <button
              type="button"
              className="text-xs text-[#0d5c63] hover:underline"
              onClick={() => {
                toast.info("Forgot password", {
                  description: "Password recovery will be implemented later.",
                });
              }}
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          <PasswordInput
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(event) => handleChange("password", event.target.value)}
            disabled={loading}
            autoComplete="current-password"
            className="h-9"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] leading-relaxed text-red-700">
            {error}
          </div>
        )}

        <LoadingButton
          type="submit"
          loading={loading}
          loadingText="Signing in..."
          className="h-9"
        >
          Sign in
        </LoadingButton>

        <p className="text-center text-[13px] text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#0d5c63] hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
