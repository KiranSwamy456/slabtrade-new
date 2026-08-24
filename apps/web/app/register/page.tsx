"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { registerSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      const message =
        validation.error.issues[0]?.message ?? "Please check your information.";

      setError(message);

      toast.error("Invalid registration details", {
        description: message,
      });

      return;
    }

    try {
      setLoading(true);

      const { confirmPassword: _confirmPassword, ...registerData } =
        validation.data;

      await authService.register(registerData);

      setSuccess("Account created successfully. You can now sign in.");

      toast.success("Account created", {
        description: "You can now sign in with your new account.",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      setError(message);

      toast.error("Registration failed", {
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
          Create your account
        </h1>

        <p className="mt-2.5 text-[15px] leading-relaxed text-slate-500">
          Join Slab Trade and start trading securely.
        </p>
      </div>

      <form
        className="flex flex-col gap-[18px] max-[550px]:gap-[15px]"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-3.5 max-[550px]:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName" className="text-xs text-slate-700">
              First name
            </Label>

            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(event) =>
                handleChange("firstName", event.target.value)
              }
              disabled={loading}
              className="h-9"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName" className="text-xs text-slate-700">
              Last name
            </Label>

            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              disabled={loading}
              className="h-9"
            />
          </div>
        </div>

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
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone" className="text-xs text-slate-700">
            Phone number{" "}
            <span className="font-normal text-slate-400">Optional</span>
          </Label>

          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            disabled={loading}
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs text-slate-700">
            Password
          </Label>

          <PasswordInput
            id="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={(event) => handleChange("password", event.target.value)}
            disabled={loading}
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword" className="text-xs text-slate-700">
            Confirm password
          </Label>

          <PasswordInput
            id="confirmPassword"
            placeholder="Enter your password again"
            value={formData.confirmPassword}
            onChange={(event) =>
              handleChange("confirmPassword", event.target.value)
            }
            disabled={loading}
            className="h-9"
          />
        </div>

        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            ✓
          </div>

          <div>
            <strong className="text-[13px] text-blue-900">
              Customer account
            </strong>

            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              New accounts are registered as Customers. Other roles are
              assigned by administrators.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] leading-relaxed text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 text-[13px] leading-relaxed text-green-700">
            {success}
          </div>
        )}

        <LoadingButton
          type="submit"
          loading={loading}
          loadingText="Creating account..."
          className="h-9"
        >
          Create account
        </LoadingButton>

        <p className="text-center text-[13px] text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
