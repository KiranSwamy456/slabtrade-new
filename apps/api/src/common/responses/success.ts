import { Response } from "express";
import { ApiResponse } from "./api-response";

interface SuccessOptions<T> {
  message?: string;
  data?: T;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

export function successResponse<T>(res: Response, options: SuccessOptions<T>) {
  const response: ApiResponse<T> = {
    success: true,
    message: options.message ?? "Success",
    data: options.data,
    meta: options.meta,
  };

  return res.status(options.statusCode ?? 200).json(response);
}
