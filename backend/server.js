import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./db/dbconnect.js";

import userRoutes from "./routes/userroutes.js";
import menuRoutes from "./routes/menuroutes.js";
import orderRoutes from "./routes/orderroutes.js";
import authMiddleware from "./middleware/usermiddleware.js"; // ✅ NEW

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", authMiddleware, orderRoutes); // ✅ Protected

app.get("/", (req, res) => {
  res.send("Fast Food API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
