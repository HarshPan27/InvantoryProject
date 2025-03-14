const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL for product image
  basePrice: { type: Number, required: true },  // ✅ Ensure `basePrice` exists
  stockLevel: { type: Number, required: true, default: 0 },  // ✅ Ensure `stockLevel` exists
  salesTrend: { type: Number, required: true, default: 0 }, 
  expirationDate: { type: Date }, // ✅ Added expiration date (optional)
  suggestedPrice: { type: Number, default: null }, // ✅ Added suggested dynamic price
  category: { type: String },
});

module.exports = mongoose.model("InventoryItem", InventoryItemSchema);