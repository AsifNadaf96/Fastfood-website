import Order from "../models/order.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;

    if (!items || !total) {
      return res.status(400).json({ error: "Items and total price are required" });
    }

    // Find any pending order for the user
    let order = await Order.findOne({ user: userId, status: "pending" });

    const newItem = items[0]; // assuming only one item per request

    if (order) {
      // Check if item already exists
      const existingItem = order.items.find(i => i.name === newItem.name);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        order.items.push({ name: newItem.name, quantity: newItem.quantity, price: newItem.price });
      }
      // Recalculate total
      order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await order.save();
      res.json({ message: "Order updated!", order });
    } else {
      // No pending order, create new
      order = await Order.create({ user: userId, items, total, status: "pending" });
      res.status(201).json({ message: "Order placed successfully!", order });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const getOrders = async (req, res) => {
  try {
    let userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // FIX: Use 'new' keyword here
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const orders = await Order.find({ user: objectUserId }).sort({ createdAt: -1 });
    console.log("Orders found:", orders.length);
    res.json(orders);
  } catch (err) {
    console.error("Detailed error in getOrders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const removeOrderItem = async (req, res) => {
  try {
    const { orderId, itemName } = req.params;

    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ error: "Order or item not found" });
    }

    order.items = order.items.filter(item => item.name !== itemName);
    order.total = order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    if (order.items.length === 0) {
      await order.deleteOne();
      return res.json({ message: "Order removed because no items left." });
    } else {
      await order.save();
      return res.json({ message: "Item removed", order });
    }
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

