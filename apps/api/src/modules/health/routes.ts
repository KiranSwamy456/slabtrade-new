import { Router } from "express";
import { healthController } from "./controller";

const router: Router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health Check
 *     description: Returns the current health status of the API.
 *     responses:
 *       200:
 *         description: API is running successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is running
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: UP
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get("/", healthController);

export default router;
