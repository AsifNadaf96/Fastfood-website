import express from "express";
import { placeOrder, getOrders } from "../controller/ordercontroller.js";
const router = express.Router();

router.post("/", placeOrder);
router.get("/:userId", getOrders);

export default router
