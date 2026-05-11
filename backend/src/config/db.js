const { Pool } = require("pg");
const { MongoClient } = require("mongodb");

// ── Postgres ──────────────────────────────────────────────
let pgPool;

async function getPostgres() {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        "postgresql://agro:agrosecret@localhost:5432/agroconnect",
    });
    // Create tables if not exist
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(200) NOT NULL,
        role VARCHAR(20) DEFAULT 'farmer',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✅ Postgres connected & tables ready");
  }
  return pgPool;
}

// ── MongoDB ───────────────────────────────────────────────
let mongoDb;

async function getMongo() {
  if (!mongoDb) {
    const client = new MongoClient(
      process.env.MONGO_URI || "mongodb://localhost:27017/agroconnect"
    );
    await client.connect();
    mongoDb = client.db("agroconnect");
    console.log("✅ Mongo connected");
  }
  return mongoDb;
}

module.exports = { getPostgres, getMongo };
