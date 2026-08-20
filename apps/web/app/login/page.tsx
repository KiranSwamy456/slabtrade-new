"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { authStorage } from "@/lib/auth/auth-storage";
import { getRoleDashboard } from "@/lib/auth/role-redirect";

import styles from "./login.module.css";

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
      <div className={styles.header}>
        <h1>Welcome back</h1>

        <p>Sign in to your Granite Marketplace account.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <div className={styles.passwordHeader}>
            <label htmlFor="password">Password</label>

            <button
              type="button"
              className={styles.forgotButton}
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

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(event) => handleChange("password", event.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? (
            <>
              <span className={styles.spinner} />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className={styles.registerText}>
          Don&apos;t have an account?{" "}
          <Link href="/register">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
