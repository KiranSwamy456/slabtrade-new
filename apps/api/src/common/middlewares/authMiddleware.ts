import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "@common/utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        success: false,
        message: "Authorization token is required",
        errors: [],
      });
      return;
    }

    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format",
        errors: [],
      });
      return;
    }

    const token = authorization.substring(7).trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
        errors: [],
      });
      return;
    }

    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
      errors: [],
    });
  }
};
