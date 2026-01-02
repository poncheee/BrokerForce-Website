const express = require("express");
const router = express.Router();
const { query } = require("../db");

// Get current user
router.get("/me", async (req, res) => {
  console.log("=== /api/me Request ===");
  console.log("req.user:", req.user ? { id: req.user.id, name: req.user.name } : "null");
  console.log("req.sessionID:", req.sessionID);
  console.log("Cookies:", req.headers.cookie ? "present" : "missing");
  console.log("Session exists:", !!req.session);
  
  if (req.user) {
    try {
      // Get user from database to ensure we have latest data
      const result = await query("SELECT * FROM users WHERE id = $1", [
        req.user.id,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log("User found in database:", user.name);
        res.json({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.google_id,
            createdAt: user.created_at,
          },
        });
      } else {
        console.log("User not found in database for id:", req.user.id);
        res.status(401).json({
          user: null,
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        user: null,
        message: "Error fetching user",
      });
    }
  } else {
    console.log("No req.user - not authenticated");
    res.status(401).json({
      user: null,
      message: "Not authenticated",
    });
  }
});

// Get session status
router.get("/session", (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user
      ? {
          id: req.user.id,
          username: req.user.username,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          googleId: req.user.googleId,
          createdAt: req.user.createdAt,
        }
      : null,
  });
});

module.exports = router;
