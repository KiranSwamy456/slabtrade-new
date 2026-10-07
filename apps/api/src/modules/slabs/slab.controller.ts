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

  getMarketplaceListings = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const listings = await this.slabService.getMarketplaceListings();

      res.status(200).json({
        success: true,
        message: "Marketplace listings fetched successfully",
        data: listings,
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

  getAdminListings = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const listings = await this.slabService.getAdminListings();

      res.status(200).json({
        success: true,
        message: "Slab listings fetched successfully",
        data: listings,
      });
    } catch (error) {
      next(error);
    }
  };

  approveListing = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const listing = await this.slabService.approveListing(
        req.params.id as string,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Slab listing approved",
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  };

  rejectListing = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const listing = await this.slabService.rejectListing(
        req.params.id as string,
      );

      res.status(200).json({
        success: true,
        message: "Slab listing rejected",
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  };

  updateListingStatus = async (
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

      const listing = await this.slabService.setListingStatus(
        vendorId,
        req.params.id as string,
        req.body.status,
      );

      res.status(200).json({
        success: true,
        message:
          listing.status === 1
            ? "Slab listing activated"
            : "Slab listing deactivated",
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  };
}
