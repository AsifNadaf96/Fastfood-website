import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController.js";

const router = express.Router();

// Get all orders - admin only
router.get("/", authenticate, adminMiddleware, getAllOrders);

// Update order status - admin only
router.put("/:id/status", authenticate, adminMiddleware, updateOrderStatus);

export default router;
