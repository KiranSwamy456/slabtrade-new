import { Express } from "express";

import { healthRoutes } from "@modules/health";
import authRoutes from "@modules/auth/auth.routes";
import userRoutes from "@modules/users/user.routes";

export const registerRoutes = (app: Express): void => {
  app.use("/health", healthRoutes);

  app.use("/auth", authRoutes);

  app.use("/users", userRoutes);
};
