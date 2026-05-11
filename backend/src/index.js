const express = require("express");
const cors = require("cors");
const { getPostgres, getMongo } = require("./config/db");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const predictRoutes = require("./routes/predict");
const soilRoutes = require("./routes/soil");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Health check ──────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/soil", soilRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────
async function start() {
  try {
    await getPostgres();
    await getMongo();
    app.listen(PORT, () => {
      console.log(`🌾 AgroConnect Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
