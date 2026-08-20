import { NextFunction, Request, Response } from "express";

import { AppError } from "@common/errors/AppError";
import { logger } from "@common/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: [],
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};
