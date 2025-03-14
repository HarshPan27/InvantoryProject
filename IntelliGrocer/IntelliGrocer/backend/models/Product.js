const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true }, // ✅ Added basePrice
  expirationDate: { type: Date, required: true }, // ✅ Added expirationDate
  salesTrend: { type: Number, required: true }, // ✅ Added salesTrend
  stockLevel: { type: Number, required: true }, // ✅ Added stockLevel
});

module.exports = mongoose.model("Product", ProductSchema);
