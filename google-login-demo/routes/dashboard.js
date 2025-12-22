// User Dashboard API routes
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

// Get dashboard data
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get favorites count
    const favoritesResult = await query(
      "SELECT COUNT(*) as count FROM user_favorites WHERE user_id = $1",
      [userId]
    );
    const favoritesCount = parseInt(favoritesResult.rows[0].count);

    // Get purchases summary
    const purchasesResult = await query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'payment_completed') as completed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'representation_signed') as signed,
        COALESCE(SUM(total_amount), 0) as total_amount
       FROM purchase_requests
       WHERE user_id = $1`,
      [userId]
    );

    // Get recent purchases
    const recentPurchasesResult = await query(
      `SELECT * FROM purchase_requests
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Get offers summary
    const offersResult = await query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
       FROM offers
       WHERE user_id = $1`,
      [userId]
    );

    // Get documents count
    const documentsResult = await query(
      "SELECT COUNT(*) as count FROM documents WHERE user_id = $1",
      [userId]
    );
    const documentsCount = parseInt(documentsResult.rows[0].count);

    // Get payment history summary
    const paymentsResult = await query(
      `SELECT
        COUNT(*) as total,
        COALESCE(SUM(amount), 0) as total_amount
       FROM payments
       WHERE user_id = $1`,
      [userId]
    );

    res.json({
      stats: {
        favorites: favoritesCount,
        purchases: purchasesResult.rows[0],
        offers: offersResult.rows[0],
        documents: documentsCount,
        payments: paymentsResult.rows[0],
      },
      recentPurchases: recentPurchasesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
