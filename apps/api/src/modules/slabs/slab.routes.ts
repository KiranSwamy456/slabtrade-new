import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { requireRole } from "@common/middlewares/roleMiddleware";
import { validate } from "@common/middlewares/validate";

import { SlabController } from "./slab.controller";
import {
  approveSlabListingSchema,
  createSlabListingSchema,
  updateSlabStatusSchema,
} from "./slab.schema";
import { uploadSlabImages } from "./slab.upload";

const router: Router = Router();

const slabController = new SlabController();

router.get(
  "/",
  authMiddleware,
  requireRole("Vendor"),
  slabController.getMyListings,
);

router.get(
  "/marketplace",
  authMiddleware,
  requireRole("Customer"),
  slabController.getMarketplaceListings,
);

router.get(
  "/admin",
  authMiddleware,
  requireRole("Admin"),
  slabController.getAdminListings,
);

router.patch(
  "/:id/approve",
  authMiddleware,
  requireRole("Admin"),
  validate(approveSlabListingSchema),
  slabController.approveListing,
);

router.patch(
  "/:id/reject",
  authMiddleware,
  requireRole("Admin"),
  slabController.rejectListing,
);

router.post(
  "/",
  authMiddleware,
  requireRole("Vendor"),
  uploadSlabImages,
  validate(createSlabListingSchema),
  slabController.createSlabListing,
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("Vendor"),
  validate(updateSlabStatusSchema),
  slabController.updateListingStatus,
);

export default router;
