// Offers API routes
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

// Get all offers for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM offers
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ offers: result.rows });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// Get offer by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM offers
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.json({ offer: result.rows[0] });
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ error: "Failed to fetch offer" });
  }
});

// Create offer
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      purchaseRequestId,
      propertyId,
      offerAmount,
      financingType,
      closingDate,
      contingencies,
    } = req.body;

    if (!propertyId || !offerAmount) {
      return res
        .status(400)
        .json({ error: "Property ID and offer amount are required" });
    }

    const offerId = `offer-${Date.now()}-${uuidv4()}`;

    // Store additional offer details in offer_data JSONB field (we'll need to add this to schema)
    // For now, store contingencies in a notes field or we can add offer_details column
    const offerDetails = {
      closingDate: closingDate || null,
      contingencies: contingencies || null,
    };

    const result = await query(
      `INSERT INTO offers
       (id, purchase_request_id, user_id, property_id, offer_amount, status, financing_type, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'submitted', $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        offerId,
        purchaseRequestId || null,
        req.user.id,
        propertyId,
        offerAmount,
        financingType || null,
      ]
    );

    res.status(201).json({ offer: result.rows[0] });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Failed to create offer" });
  }
});

// Update offer
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, signedDocumentUrl, agentResponse } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (signedDocumentUrl !== undefined) {
      updates.push(`signed_document_url = $${paramIndex++}`);
      values.push(signedDocumentUrl);
    }
    if (agentResponse !== undefined) {
      updates.push(`agent_response = $${paramIndex++}`);
      values.push(agentResponse);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, req.user.id);

    const result = await query(
      `UPDATE offers
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.json({ offer: result.rows[0] });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ error: "Failed to update offer" });
  }
});

module.exports = router;
