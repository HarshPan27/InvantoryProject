const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/InventoryItem");
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    console.log("📢 Received Order Request:", req.body);

    const { userId, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order items" });
    }

    let totalAmount = 0;

    for (let orderItem of items) {
      const inventoryItem = await InventoryItem.findById(orderItem.itemId);
      if (!inventoryItem) {
        return res.status(404).json({ error: `Item ${orderItem.itemId} not found` });
      }

      if (inventoryItem.stockLevel < orderItem.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${inventoryItem.name}` });
      }

      // ✅ Reduce stock level
      inventoryItem.stockLevel -= orderItem.quantity;
      await inventoryItem.save();

      // ✅ Calculate totalAmount
      totalAmount += inventoryItem.basePrice * orderItem.quantity;
    }

    // ✅ Create new order with totalAmount
    const newOrder = new Order({ userId, items, totalAmount });
    await newOrder.save();

    res.json({ message: "Order placed successfully!", totalAmount });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;