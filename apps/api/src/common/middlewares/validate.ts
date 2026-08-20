import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.body);

      req.body = result;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });

        return;
      }

      next(error);
    }
  };
};
