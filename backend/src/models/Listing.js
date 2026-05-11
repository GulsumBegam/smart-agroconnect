const { getMongo } = require("../config/db");
const { v4: uuid } = require("uuid");

class Listing {
  static async create(data) {
    const db = await getMongo();
    const listing = {
      _id: uuid(),
      ...data,
      bids: [],
      createdAt: new Date(),
    };
    await db.collection("listings").insertOne(listing);
    return listing;
  }

  static async findAll({ category, status } = {}) {
    const db = await getMongo();
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    return db.collection("listings").find(filter).sort({ createdAt: -1 }).toArray();
  }

  static async findById(id) {
    const db = await getMongo();
    return db.collection("listings").findOne({ _id: id });
  }

  static async addBid(listingId, bid) {
    const db = await getMongo();
    const bidEntry = {
      _id: uuid(),
      ...bid,
      createdAt: new Date(),
    };
    await db.collection("listings").updateOne(
      { _id: listingId },
      { $push: { bids: bidEntry } }
    );
    return bidEntry;
  }

  static async updateStatus(listingId, status) {
    const db = await getMongo();
    await db.collection("listings").updateOne(
      { _id: listingId },
      { $set: { status } }
    );
  }
}

module.exports = Listing;
