import { NextFunction, Request, Response } from "express";

import { OrderService } from "./order.service";

export class OrderController {
  private readonly orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customerId = req.user?.userId;

      if (!customerId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const order = await this.orderService.createOrder(customerId, req.body);

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customerId = req.user?.userId;

      if (!customerId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const orders = await this.orderService.getOrdersForCustomer(customerId);

      res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await this.orderService.updateOrderStatus(
        req.params.id as string,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: `Order marked as ${order.status}`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const orders = await this.orderService.getAllOrders();

      res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  getVendorOrderItems = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const vendorId = req.user?.userId;

      if (!vendorId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const items = await this.orderService.getOrderItemsForVendor(vendorId);

      res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };
}
