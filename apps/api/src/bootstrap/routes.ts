import path from "node:path";
import express, { Express } from "express";

import { healthRoutes } from "@modules/health";
import authRoutes from "@modules/auth/auth.routes";
import userRoutes from "@modules/users/user.routes";
import slabRoutes from "@modules/slabs/slab.routes";
import orderRoutes from "@modules/orders/order.routes";

export const registerRoutes = (app: Express): void => {
  app.use("/health", healthRoutes);

  app.use("/auth", authRoutes);

  app.use("/users", userRoutes);

  app.use("/slabs", slabRoutes);

  app.use("/orders", orderRoutes);

  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), "uploads")),
  );
};
