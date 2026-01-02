const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }?auth=error`,
  }),
  async (req, res) => {
    console.log("=== Google OAuth Callback ===");
    console.log("req.user:", req.user ? { id: req.user.id, name: req.user.name, email: req.user.email } : "null");
    console.log("req.sessionID:", req.sessionID);
    console.log("Session exists:", !!req.session);

    // Save session before redirecting to ensure cookie is set
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }?auth=error&message=session_failed`
        );
      }

      console.log("Session saved successfully, sessionID:", req.sessionID);
      console.log("User in session:", req.user ? req.user.id : "null");

      // Successful authentication, redirect to frontend
      const redirectUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }?auth=success`;
      console.log("Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    });
  }
);

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({
          success: false,
          message: "Session cleanup failed",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
});

// Get current user (for API calls)
router.get("/me", (req, res) => {
  if (req.user) {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        googleId: req.user.googleId,
        createdAt: req.user.createdAt,
      },
    });
  } else {
    res.status(401).json({
      user: null,
      message: "Not authenticated",
    });
  }
});

module.exports = router;
