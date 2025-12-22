// Purchases API routes
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

// Get all purchases for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM purchase_requests
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ purchases: result.rows });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// Get purchase by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM purchase_requests
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json({ purchase: result.rows[0] });
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
});

// Create purchase request
router.post("/", requireAuth, async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const purchaseId = `purchase-${Date.now()}-${uuidv4()}`;

    const result = await query(
      `INSERT INTO purchase_requests
       (id, user_id, property_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [purchaseId, req.user.id, propertyId]
    );

    res.status(201).json({ purchase: result.rows[0] });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

// Update purchase request (submit representation form, payment, etc.)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      representationData,
      selectedServices,
      totalAmount,
      paymentData,
      offerData,
      status,
    } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (representationData !== undefined) {
      updates.push(`representation_data = $${paramIndex++}`);
      values.push(JSON.stringify(representationData));
    }
    if (selectedServices !== undefined) {
      updates.push(`selected_services = $${paramIndex++}`);
      values.push(selectedServices);
    }
    if (totalAmount !== undefined) {
      updates.push(`total_amount = $${paramIndex++}`);
      values.push(totalAmount);
    }
    if (paymentData !== undefined) {
      updates.push(`payment_data = $${paramIndex++}`);
      values.push(JSON.stringify(paymentData));
    }
    if (offerData !== undefined) {
      updates.push(`offer_data = $${paramIndex++}`);
      values.push(JSON.stringify(offerData));
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, req.user.id);

    const result = await query(
      `UPDATE purchase_requests
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json({ purchase: result.rows[0] });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ error: "Failed to update purchase" });
  }
});

module.exports = router;
