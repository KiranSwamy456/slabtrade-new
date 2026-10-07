import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { requireRole } from "@common/middlewares/roleMiddleware";
import { validate } from "@common/middlewares/validate";

import { OrderController } from "./order.controller";
import { createOrderSchema, updateOrderStatusSchema } from "./order.schema";

const router: Router = Router();

const orderController = new OrderController();

router.post(
  "/",
  authMiddleware,
  requireRole("Customer"),
  validate(createOrderSchema),
  orderController.createOrder,
);

router.get(
  "/mine",
  authMiddleware,
  requireRole("Customer"),
  orderController.getMyOrders,
);

router.get(
  "/vendor",
  authMiddleware,
  requireRole("Vendor"),
  orderController.getVendorOrderItems,
);

router.get(
  "/",
  authMiddleware,
  requireRole("Admin"),
  orderController.getAllOrders,
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("Admin"),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

export default router;
