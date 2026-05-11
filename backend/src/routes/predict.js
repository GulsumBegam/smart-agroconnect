const express = require("express");
const router = express.Router();

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://ml-service:8000";

// ── POST /api/predict/crop ────────────────────────────────
router.post("/crop", async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } =
      req.body;

    if (
      nitrogen == null ||
      phosphorus == null ||
      potassium == null ||
      temperature == null ||
      humidity == null ||
      ph == null ||
      rainfall == null
    ) {
      return res.status(400).json({
        error:
          "All fields required: nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall",
      });
    }

    const response = await fetch(`${ML_SERVICE_URL}/predict/crop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nitrogen,
        phosphorus,
        potassium,
        temperature,
        humidity,
        ph,
        rainfall,
      }),
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("Crop predict error:", err.message);
    res.status(502).json({ error: "Prediction service unavailable" });
  }
});

// ── POST /api/predict/price ───────────────────────────────
router.post("/price", async (req, res) => {
  try {
    const { crop, market, month } = req.body;

    if (!crop) {
      return res.status(400).json({ error: "crop is required" });
    }

    const response = await fetch(`${ML_SERVICE_URL}/predict/price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, market: market || "default", month: month || 1 }),
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("Price predict error:", err.message);
    res.status(502).json({ error: "Prediction service unavailable" });
  }
});

module.exports = router;
