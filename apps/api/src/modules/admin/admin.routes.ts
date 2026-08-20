import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { roleMiddleware } from "@common/middlewares/roleMiddleware";
import { validate } from "@common/middlewares/validate";

import { AdminController } from "./admin.controller";
import { createAdminUserSchema } from "./admin.schema";

const router: Router = Router();

const adminController = new AdminController();

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("Admin"),
  validate(createAdminUserSchema),
  adminController.createUser,
);

export default router;
