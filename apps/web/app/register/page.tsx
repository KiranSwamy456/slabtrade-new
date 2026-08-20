"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import { registerSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";

import styles from "./register.module.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Please check your information.",
      );
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword: _confirmPassword, ...registerData } =
        validation.data;

      await authService.register(registerData);

      setSuccess("Account created successfully. You can now sign in.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.header}>
        <h1>Create your account</h1>

        <p>Join Granite Marketplace and start trading securely.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="firstName">First name</label>

            <input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(event) =>
                handleChange("firstName", event.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName">Last name</label>

            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">
            Phone number <span className={styles.optional}>Optional</span>
          </label>

          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={(event) => handleChange("password", event.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirm password</label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Enter your password again"
            value={formData.confirmPassword}
            onChange={(event) =>
              handleChange("confirmPassword", event.target.value)
            }
            disabled={loading}
          />
        </div>

        <div className={styles.roleInfo}>
          <div className={styles.roleIcon}>✓</div>

          <div>
            <strong>Customer account</strong>

            <p>
              New accounts are registered as Customers. Other roles are assigned
              by administrators.
            </p>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {success && <div className={styles.success}>{success}</div>}

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? (
            <>
              <span className={styles.spinner} />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className={styles.loginText}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
