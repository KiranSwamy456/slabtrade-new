import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

import { AppError } from "@common/errors/AppError";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "slab-listings");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const slabImageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
      return;
    }

    cb(null, true);
  },
});

export const uploadSlabImages = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  slabImageUpload.array("images", 8)(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      next(new AppError(error.message, 400));
      return;
    }

    if (error instanceof Error) {
      next(new AppError(error.message, 400));
      return;
    }

    next();
  });
};

export const SLAB_IMAGE_URL_PREFIX = "/uploads/slab-listings";
