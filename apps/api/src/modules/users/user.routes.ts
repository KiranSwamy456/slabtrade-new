import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { requireRole } from "@common/middlewares/roleMiddleware";
import { validate } from "@common/middlewares/validate";

import { UserController } from "./user.controller";
import { createUserSchema, updateUserStatusSchema } from "./user.schema";

const router: Router = Router();

const userController = new UserController();

router.get("/", authMiddleware, requireRole("Admin"), userController.getUsers);

router.post(
  "/",
  authMiddleware,
  requireRole("Admin"),
  validate(createUserSchema),
  userController.createUser,
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("Admin"),
  validate(updateUserStatusSchema),
  userController.updateStatus,
);

export default router;
