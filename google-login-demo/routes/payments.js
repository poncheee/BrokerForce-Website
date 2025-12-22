// Payments API routes
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

// Get all payments for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM payments
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ payments: result.rows });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Get payment by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM payments
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

module.exports = router;
