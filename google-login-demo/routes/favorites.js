// Favorites API routes
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

// Get user's favorites
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, property_id, property_data, created_at
       FROM user_favorites
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ favorites: result.rows });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// Add favorite
router.post("/", requireAuth, async (req, res) => {
  try {
    const { propertyId, propertyData } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const result = await query(
      `INSERT INTO user_favorites (user_id, property_id, property_data, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, property_id) DO NOTHING
       RETURNING *`,
      [req.user.id, propertyId, JSON.stringify(propertyData || {})]
    );

    if (result.rows.length === 0) {
      // Already exists
      return res.json({ message: "Already in favorites", favorite: null });
    }

    res.json({ favorite: result.rows[0] });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Remove favorite
router.delete("/:propertyId", requireAuth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const result = await query(
      `DELETE FROM user_favorites
       WHERE user_id = $1 AND property_id = $2
       RETURNING *`,
      [req.user.id, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite removed", favorite: result.rows[0] });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Check if property is favorited
router.get("/check/:propertyId", requireAuth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const result = await query(
      `SELECT * FROM user_favorites
       WHERE user_id = $1 AND property_id = $2`,
      [req.user.id, propertyId]
    );

    res.json({ isFavorite: result.rows.length > 0 });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ error: "Failed to check favorite" });
  }
});

module.exports = router;
