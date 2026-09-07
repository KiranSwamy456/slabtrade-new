import { Router } from "express";

import { authMiddleware } from "@common/middlewares/authMiddleware";
import { requireRole } from "@common/middlewares/roleMiddleware";
import { validate } from "@common/middlewares/validate";

import { SlabController } from "./slab.controller";
import {
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
