import { Response } from "express";
import { ApiResponse } from "./api-response";

interface ErrorOptions {
  message?: string;
  statusCode?: number;
  errors?: unknown;
}

export function errorResponse(res: Response, options: ErrorOptions) {
  const response: ApiResponse = {
    success: false,
    message: options.message ?? "Something went wrong",
    errors: options.errors,
  };

  return res.status(options.statusCode ?? 500).json(response);
}
