import express from "express";
import { placeOrder, getOrders ,removeOrderItem } from "../controller/ordercontroller.js";
import { authenticate } from "../middleware/usermiddleware.js";

const router = express.Router();

router.post("/", authenticate, placeOrder);
router.get("/", authenticate, async (req, res, next) => {
  try {
    await getOrders(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected error" });
  }
});
router.get("/:userId", authenticate, getOrders);
router.delete("/:orderId/item/:itemName", authenticate, removeOrderItem);


export default router;
