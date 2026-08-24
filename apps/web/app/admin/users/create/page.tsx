"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { z } from "zod";
import { toast } from "sonner";

import { userService } from "@/services/user.service";
import { authStorage } from "@/lib/auth/auth-storage";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const createUserSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    role: z.enum(["Customer", "Vendor", "Support", "Admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "Customer" | "Vendor" | "Support" | "Admin";
};

const ROLE_OPTIONS: {
  value: CreateUserFormData["role"];
  description: string;
}[] = [
  { value: "Customer", description: "Marketplace customer" },
  { value: "Vendor", description: "Marketplace seller" },
  { value: "Support", description: "Customer support" },
  { value: "Admin", description: "System administrator" },
];

export default function CreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUserFormData, string>>
  >({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateUserFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      const validation = validateForm();

      if (!validation) {
        return;
      }

      const accessToken = authStorage.getAccessToken();

      if (!accessToken) {
        toast.error("Authentication required", {
          description: "Please sign in again.",
        });

        router.push("/login");

        return;
      }

      const response = await userService.createUser(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        },
        accessToken,
      );

      toast.success("User created successfully", {
        description: `${response.data.firstName} has been created as ${response.data.role?.name}.`,
      });

      router.push("/admin/users");
    } catch (error) {
      toast.error("Failed to create user", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const result = createUserSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateUserFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateUserFormData;

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      toast.error("Please check the form", {
        description:
          result.error.issues[0]?.message ?? "Some fields need your attention.",
      });

      return false;
    }

    setErrors({});

    toast.success("User form is valid", {
      description: `${formData.role} user is ready to be created.`,
    });

    return true;
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 max-[700px]:px-4 max-[700px]:py-7">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-7">
          <Link
            href="/admin/users"
            className="mb-4 inline-block text-sm text-blue-600 hover:underline"
          >
            ← Back to Users
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">Create User</h1>

          <p className="mt-2 text-[15px] text-slate-500">
            Create a new Slab Trade user and assign their role.
          </p>
        </div>

        <Card className="gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
          <form onSubmit={handleSubmit}>
            <section className="border-b border-slate-200 p-7 px-8 max-[700px]:p-5">
              <div className="mb-[22px]">
                <h2 className="text-lg font-semibold text-slate-900">
                  Basic information
                </h2>
                <p className="mt-[5px] text-sm text-slate-500">
                  User account details
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5 max-[700px]:grid-cols-1">
                <div className="mb-4 flex flex-col gap-1.5">
                  <Label htmlFor="firstName" className="text-xs text-slate-700">
                    First name <span className="text-red-500">*</span>
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

                  {errors.firstName && (
                    <small className="text-xs text-red-600">
                      {errors.firstName}
                    </small>
                  )}
                </div>

                <div className="mb-4 flex flex-col gap-1.5">
                  <Label htmlFor="lastName" className="text-xs text-slate-700">
                    Last name
                  </Label>

                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(event) =>
                      handleChange("lastName", event.target.value)
                    }
                    disabled={loading}
                    className="h-9"
                  />

                  {errors.lastName && (
                    <small className="text-xs text-red-600">
                      {errors.lastName}
                    </small>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 max-[700px]:grid-cols-1">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs text-slate-700">
                    Email address <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    disabled={loading}
                    className="h-9"
                  />

                  {errors.email && (
                    <small className="text-xs text-red-600">
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-xs text-slate-700">
                    Phone number
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    disabled={loading}
                    className="h-9"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-slate-200 p-7 px-8 max-[700px]:p-5">
              <div className="mb-[22px]">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account role
                </h2>
                <p className="mt-[5px] text-sm text-slate-500">
                  Choose the role this user will have.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2 max-[420px]:grid-cols-1">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 text-left transition-colors hover:border-blue-300",
                      formData.role === role.value &&
                        "border-blue-600 bg-blue-50 shadow-[0_0_0_1px_#2563eb] hover:border-blue-600",
                    )}
                    onClick={() => handleChange("role", role.value)}
                    disabled={loading}
                  >
                    <div
                      className={cn(
                        "flex size-[22px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-white",
                        formData.role === role.value && "border-blue-600 bg-blue-600",
                      )}
                    >
                      {formData.role === role.value ? "✓" : ""}
                    </div>

                    <div>
                      <strong className="text-sm text-slate-900">
                        {role.value}
                      </strong>

                      <p className="mt-1 text-xs text-slate-500">
                        {role.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {errors.role && (
                <small className="mt-2 block text-xs text-red-600">
                  {errors.role}
                </small>
              )}
            </section>

            <section className="border-b border-slate-200 p-7 px-8 max-[700px]:p-5">
              <div className="mb-[22px]">
                <h2 className="text-lg font-semibold text-slate-900">
                  Security
                </h2>
                <p className="mt-[5px] text-sm text-slate-500">
                  Set the user&apos;s initial password.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5 max-[700px]:grid-cols-1">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-xs text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      disabled={loading}
                      className="h-9 pr-[70px]"
                    />

                    <button
                      type="button"
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-semibold text-blue-600"
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.password && (
                    <small className="text-xs text-red-600">
                      {errors.password}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-xs text-slate-700"
                  >
                    Confirm password <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter password again"
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        handleChange("confirmPassword", event.target.value)
                      }
                      disabled={loading}
                      className="h-9 pr-[70px]"
                    />

                    <button
                      type="button"
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-semibold text-blue-600"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <small className="text-xs text-red-600">
                      {errors.confirmPassword}
                    </small>
                  )}
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-3 bg-slate-50 px-8 py-6 max-[700px]:px-5">
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => router.push("/admin/users")}
                disabled={loading}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                className="h-9"
                loading={loading}
                loadingText="Creating..."
              >
                Create User
              </LoadingButton>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
