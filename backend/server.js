import dotenv from "dotenv";
dotenv.config(); // must be called before using process.env
import express from "express";
import cors from "cors";
import connectDB from "./db/dbconnect.js"; // ✅ adjust path if needed

// ✅ Use `import` instead of `require`:
import userRoutes from "./routes/userroutes.js";
import menuRoutes from "./routes/menuroutes.js";
import orderRoutes from "./routes/orderroutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Mount routes
app.use("/api/auth", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
  res.send("Fast Food API is running 🚀");
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
