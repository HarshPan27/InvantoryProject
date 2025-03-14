const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/InventoryItem");

// 📌 Fetch Dynamic Pricing Data
router.get("/dynamic", async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();

    if (!inventoryItems.length) {
      return res.status(404).json({ message: "No pricing data found" });
    }

    // Apply dynamic pricing logic
    const applyDynamicPricing = (item) => {
      if (!item || !item.basePrice) return null; // Ensure basePrice exists

      let priceAdjustmentFactor = 1.0;
      let priceMessage = "";

      if (item.stockLevel > 30 && item.salesTrend < 50) {
        priceAdjustmentFactor -= 0.25;
        priceMessage = "Discounted due to low demand";
      }

      if (item.stockLevel < 10 && item.salesTrend > 70) {
        priceAdjustmentFactor += 0.30;
        priceMessage = "Price increased due to high demand";
      }

      const daysUntilExpiration = item.expirationDate
        ? (new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
        : null;

      if (daysUntilExpiration !== null && daysUntilExpiration < 7) {
        priceAdjustmentFactor -= 0.35;
        priceMessage = "Discounted due to expiration risk";
      }

      if (item.stockLevel > 50 && item.salesTrend > 60) {
        priceAdjustmentFactor -= 0.10;
        priceMessage = "Discounted due to overstock";
      }

      const suggestedPrice = (item.basePrice * priceAdjustmentFactor).toFixed(2);
      const minimumPrice = item.basePrice * 0.5;
      const finalSuggestedPrice = Math.max(parseFloat(suggestedPrice), minimumPrice).toFixed(2);

      return {
        name: item.name,
        currentPrice: item.basePrice.toFixed(2),
        suggestedPrice: finalSuggestedPrice,
        priceMessage: priceMessage,
      };
    };

    const pricingData = inventoryItems.map(applyDynamicPricing).filter((item) => item !== null);

    res.json(pricingData);
  } catch (error) {
    console.error("❌ Error fetching dynamic pricing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Adjust Sales Trend Based on Purchases
router.post("/update-sales", async (req, res) => {
  try {
    const { itemId, quantity, action } = req.body; // action = "purchase" or "refund"

    const item = await InventoryItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (action === "purchase") {
      item.salesTrend += quantity; // Increase sales trend
      item.stockLevel -= quantity; // Reduce stock
    } else if (action === "refund") {
      item.salesTrend -= quantity; // Decrease sales trend
      item.stockLevel += quantity; // Increase stock
    }

    await item.save();
    res.json({ message: `Item ${action} recorded successfully`, item });
  } catch (error) {
    console.error("❌ Error updating sales trend:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;