import { NextFunction, Request, Response } from "express";

import { NotFoundError } from "@common/errors";

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
