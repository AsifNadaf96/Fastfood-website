import Order from "../models/order.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    const order = await Order.create({ userId, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
