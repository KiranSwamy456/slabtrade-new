"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { z } from "zod";
import { toast } from "sonner";

import styles from "./create-user.module.css";
import { userService } from "@/services/user.service";
import { authStorage } from "@/lib/auth/auth-storage";
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
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Link href="/admin" className={styles.backLink}>
              ← Back to Users
            </Link>

            <h1>Create User</h1>

            <p>Create a new Granite Marketplace user and assign their role.</p>
          </div>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            {/* Basic information */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Basic information</h2>

                <p>User account details</p>
              </div>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label htmlFor="firstName">
                    First name <span>*</span>
                  </label>

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

                  {errors.firstName && <small>{errors.firstName}</small>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="lastName">Last name</label>

                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(event) =>
                      handleChange("lastName", event.target.value)
                    }
                    disabled={loading}
                  />

                  {errors.lastName && <small>{errors.lastName}</small>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">
                  Email address <span>*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  disabled={loading}
                />

                {errors.email && <small>{errors.email}</small>}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Phone number</label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </section>

            {/* Role */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Account role</h2>

                <p>Choose the role this user will have.</p>
              </div>

              <div className={styles.roleGrid}>
                {[
                  {
                    value: "Customer",
                    description: "Marketplace customer",
                  },
                  {
                    value: "Vendor",
                    description: "Marketplace seller",
                  },
                  {
                    value: "Support",
                    description: "Customer support",
                  },
                  {
                    value: "Admin",
                    description: "System administrator",
                  },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    className={`${styles.roleCard} ${
                      formData.role === role.value ? styles.roleCardActive : ""
                    }`}
                    onClick={() => handleChange("role", role.value)}
                    disabled={loading}
                  >
                    <div className={styles.roleRadio}>
                      {formData.role === role.value ? "✓" : ""}
                    </div>

                    <div>
                      <strong>{role.value}</strong>

                      <p>{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {errors.role && <small>{errors.role}</small>}
            </section>

            {/* Password */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Security</h2>

                <p>Set the user's initial password.</p>
              </div>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label htmlFor="password">
                    Password <span>*</span>
                  </label>

                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.password && <small>{errors.password}</small>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="confirmPassword">
                    Confirm password <span>*</span>
                  </label>

                  <div className={styles.passwordWrapper}>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter password again"
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        handleChange("confirmPassword", event.target.value)
                      }
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <small>{errors.confirmPassword}</small>
                  )}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => router.push("/admin")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
