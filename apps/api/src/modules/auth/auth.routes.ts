import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { validate } from "@common/middlewares/validate";
import {
  authLoginRateLimiter,
  authLogoutRateLimiter,
  authRefreshRateLimiter,
  authRegisterRateLimiter,
} from "@common/middlewares/rateLimitMiddleware";

import { AuthController } from "./auth.controller";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "./auth.schema";

const router: Router = Router();

const authController = new AuthController();

router.post(
  "/register",
  authRegisterRateLimiter,
  validate(registerSchema),
  authController.register,
);

router.post(
  "/login",
  authLoginRateLimiter,
  validate(loginSchema),
  authController.login,
);

router.post(
  "/refresh",
  authRefreshRateLimiter,
  validate(refreshSchema),
  authController.refresh,
);

router.post(
  "/logout",
  authLogoutRateLimiter,
  validate(logoutSchema),
  authController.logout,
);

router.get("/profile", authMiddleware, authController.profile);

export default router;
