// Documents API routes
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

// Get all documents for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM documents
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ documents: result.rows });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Get document by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM documents
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ document: result.rows[0] });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

module.exports = router;
