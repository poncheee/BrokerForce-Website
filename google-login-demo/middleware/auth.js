// Authentication middleware
const jwt = require("jsonwebtoken");
const { query } = require("../db");

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Check for token in Authorization header or cookie
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );

    // Get user from database
    const result = await query("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      googleId: user.google_id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to require authentication (works with both session and JWT)
const requireAuth = (req, res, next) => {
  // Check for session-based auth (from Passport)
  if (req.user) {
    return next();
  }

  // Check for JWT token
  return verifyToken(req, res, next);
};

// Generate JWT token for user
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = {
  verifyToken,
  requireAuth,
  generateToken,
};
