import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:     [{ name: String, quantity: Number, price: Number }],
  total:     { type: Number, required: true },
  status:    { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
export default Order
