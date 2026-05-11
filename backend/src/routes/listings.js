const express = require("express");
const Listing = require("../models/Listing");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// ── GET /api/listings ─────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { category, status } = req.query;
    const listings = await Listing.findAll({ category, status });
    res.json(listings);
  } catch (err) {
    console.error("Listings fetch error:", err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// ── POST /api/listings ────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, quantity, unit, price, location, images } =
      req.body;

    if (!title || !category || !quantity || !price) {
      return res
        .status(400)
        .json({ error: "title, category, quantity, and price are required" });
    }

    const listing = await Listing.create({
      title,
      description: description || "",
      category,
      quantity,
      unit: unit || "kg",
      price,
      location: location || "",
      images: images || [],
      sellerId: req.user.id,
      sellerName: req.user.name,
      sellerPhone: req.user.phone,
      status: "open",
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error("Listing create error:", err);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// ── GET /api/listings/:id ─────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    console.error("Listing fetch error:", err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

// ── POST /api/listings/:id/bids ───────────────────────────
router.post("/:id/bids", authMiddleware, async (req, res) => {
  try {
    const { amount, message } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Bid amount is required" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.status !== "open") {
      return res.status(400).json({ error: "Listing is not open for bids" });
    }

    const bid = await Listing.addBid(req.params.id, {
      amount,
      message: message || "",
      bidderId: req.user.id,
      bidderName: req.user.name,
      bidderPhone: req.user.phone,
    });

    res.status(201).json(bid);
  } catch (err) {
    console.error("Bid create error:", err);
    res.status(500).json({ error: "Failed to place bid" });
  }
});

module.exports = router;
