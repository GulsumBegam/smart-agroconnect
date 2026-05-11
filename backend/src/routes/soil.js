const express = require("express");
const router = express.Router();

// ── POST /api/soil/analyze ────────────────────────────────
router.post("/analyze", async (req, res) => {
  try {
    res.json({
      status: "stub",
      message:
        "Soil analysis is a stub. Connect a soil classification model to get real results.",
      result: {
        soilType: "Alluvial",
        ph: 6.8,
        nitrogen: "Medium",
        phosphorus: "Low",
        potassium: "High",
        organicCarbon: "0.8%",
        recommendations: [
          "Add phosphorus-rich fertilizer (DAP recommended)",
          "Moderate irrigation needed",
          "Suitable for rice, wheat, sugarcane",
        ],
        confidence: 0.0,
      },
    });
  } catch (err) {
    console.error("Soil analyze error:", err);
    res.status(500).json({ error: "Soil analysis failed" });
  }
});

module.exports = router;
