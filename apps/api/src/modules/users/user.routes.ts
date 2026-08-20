import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { requireRole } from "@common/middlewares/roleMiddleware";
import { validate } from "@common/middlewares/validate";

import { UserController } from "./user.controller";
import { createUserSchema } from "./user.schema";

const router: Router = Router();

const userController = new UserController();

router.post(
  "/",
  authMiddleware,
  requireRole("Admin"),
  validate(createUserSchema),
  userController.createUser,
);

export default router;
