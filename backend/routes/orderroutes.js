import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Token format: "Bearer <token>"
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Attach user info from token
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
