const express = require("express");
const router = express.Router();

// Get current user
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

// Get session status
router.get("/session", (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user
      ? {
          id: req.user.id,
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
