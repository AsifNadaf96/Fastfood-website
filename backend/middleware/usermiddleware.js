import jwt from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user; // full user object attached
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

export { authenticate, adminMiddleware };
