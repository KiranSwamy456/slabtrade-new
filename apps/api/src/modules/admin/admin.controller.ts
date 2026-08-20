import { NextFunction, Request, Response } from "express";

import { AdminService } from "./admin.service";

export class AdminController {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.adminService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
