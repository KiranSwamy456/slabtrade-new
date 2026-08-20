import { NextFunction, Request, Response } from "express";

import { AppError } from "@common/errors";
import { errorResponse } from "@common/responses";
import { logger } from "@common/logger";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error({
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    stack: error.stack,
  });

  if (error instanceof AppError) {
    errorResponse(res, {
      statusCode: error.statusCode,
      message: error.message,
    });

    return;
  }

  errorResponse(res, {
    statusCode: 500,
    message: "Internal Server Error",
  });
};
