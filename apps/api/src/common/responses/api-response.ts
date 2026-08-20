import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: Record<string, unknown>;
}

export type ExpressResponse = Response;
