import { NextFunction, Request, Response } from "express";

type RoleName = "Customer" | "Vendor" | "Support" | "Admin";

export const roleMiddleware = (...allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(403).json({
        success: false,
        message: "User role is required",
        errors: [],
      });

      return;
    }

    if (!allowedRoles.includes(userRole as RoleName)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        errors: [],
      });

      return;
    }

    next();
  };
};

// Alias for newer routes
export const requireRole = roleMiddleware;
