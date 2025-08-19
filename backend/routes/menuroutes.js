// backend/routes/menuroutes.js
import express from "express";
import { getMenuItems, addMenuItem } from "../controller/menucontroller.js";
import { authenticate, adminMiddleware } from "../middleware/usermiddleware.js";


const router = express.Router();

// Public route
router.get("/", getMenuItems);

// Admin-only route
router.post("/",authenticate, adminMiddleware, addMenuItem);

export default router;
