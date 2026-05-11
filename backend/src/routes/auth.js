const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-in-prod";
const JWT_EXPIRY = "7d";

function signToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// ── POST /api/auth/register ───────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { phone, name, password, role } = req.body;

    if (!phone || !name || !password) {
      return res
        .status(400)
        .json({ error: "phone, name, and password are required" });
    }

    const existing = await User.findByPhone(phone);
    if (existing) {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    const user = await User.create({ phone, name, password, role });
    const token = signToken(user);

    res.status(201).json({
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ── POST /api/auth/login ──────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "phone and password are required" });
    }

    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await User.verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;
