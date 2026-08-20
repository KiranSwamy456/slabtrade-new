import { Request, Response } from "express";

import { successResponse } from "@common/responses";

import { getHealthStatus } from "./service";

export const healthController = (_req: Request, res: Response): void => {
  successResponse(res, {
    message: "API is running",
    data: getHealthStatus(),
  });
};
