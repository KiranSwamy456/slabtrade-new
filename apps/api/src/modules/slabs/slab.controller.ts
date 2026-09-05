import { NextFunction, Request, Response } from "express";

import { SlabService } from "./slab.service";
import { SLAB_IMAGE_URL_PREFIX } from "./slab.upload";

export class SlabController {
  private readonly slabService: SlabService;

  constructor() {
    this.slabService = new SlabService();
  }

  createSlabListing = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const vendorId = req.user?.userId;

      if (!vendorId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });

        return;
      }

      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      const images = files.map(
        (file) => `${SLAB_IMAGE_URL_PREFIX}/${file.filename}`,
      );

      const listing = await this.slabService.createSlabListing(
        vendorId,
        req.body,
        images,
      );

      res.status(201).json({
        success: true,
        message: "Slab listing created successfully",
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyListings = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const vendorId = req.user?.userId;

      if (!vendorId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });

        return;
      }

      const listings = await this.slabService.getVendorListings(vendorId);

      res.status(200).json({
        success: true,
        message: "Slab listings fetched successfully",
        data: listings,
      });
    } catch (error) {
      next(error);
    }
  };
}
