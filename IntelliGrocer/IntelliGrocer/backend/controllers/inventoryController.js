const InventoryItem = require("../models/InventoryItem");

// ✅ Get All Inventory Items (Now Includes Dynamic Pricing)
exports.getAllItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();

    if (items.length === 0) {
      return res.status(404).json({ message: "No inventory items found" });
    }

    // ✅ Apply dynamic pricing logic
    const updatedItems = items.map(item => {
      let priceAdjustmentFactor = 1.0;
      let priceMessage = "";

      if (item.stockLevel > 30 && item.salesTrend < 50) {
        priceAdjustmentFactor -= 0.25; // 25% discount
        priceMessage = "Discounted due to low demand";
      }

      if (item.stockLevel < 10 && item.salesTrend > 70) {
        priceAdjustmentFactor += 0.30; // 30% increase
        priceMessage = "Price increased due to high demand";
      }

      const daysUntilExpiration = (new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
      if (daysUntilExpiration < 7) {
        priceAdjustmentFactor -= 0.35; // 35% discount for near-expiry
        priceMessage = "Discounted due to expiration risk";
      }

      if (item.stockLevel > 50 && item.salesTrend > 60) {
        priceAdjustmentFactor -= 0.10;
        priceMessage = "Discounted due to overstock";
      }

      const suggestedPrice = (item.basePrice * priceAdjustmentFactor).toFixed(2);
      const minimumPrice = item.basePrice * 0.5; 
      const finalSuggestedPrice = Math.max(parseFloat(suggestedPrice), minimumPrice).toFixed(2);

      item.suggestedPrice = finalSuggestedPrice;
      return { ...item.toObject(), priceMessage };
    });

    // ✅ Save new prices to the database
    await Promise.all(updatedItems.map(item => InventoryItem.findByIdAndUpdate(item._id, { suggestedPrice: item.suggestedPrice })));

    res.json(updatedItems);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create a New Inventory Item
exports.createItem = async (req, res) => {
  try {
    const { name, description, image, basePrice, stockLevel, salesTrend, expirationDate, category } = req.body;

    // Ensure base price exists
    if (!basePrice) {
      return res.status(400).json({ error: "Base price is required" });
    }

    const newItem = new InventoryItem({
      name,
      description,
      image,
      basePrice,
      stockLevel: stockLevel || 0,
      salesTrend: salesTrend || 0,
      expirationDate,
      category,
      suggestedPrice: basePrice // Default suggested price is base price
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update Inventory Item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📢 Updating item with ID:", id);

    const updatedItem = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    // ✅ Fetch updated inventory list and return it
    const updatedInventory = await InventoryItem.find();
    res.json({ message: "Item updated successfully", updatedInventory });
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Inventory Item
exports.deleteItem = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Handle Change Requests from Employees
exports.requestChange = async (req, res) => {
  try {
    const { itemId, message, employee } = req.body;
    if (!itemId || !message || !employee) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`Change request received from ${employee}: ${message}`);
    res.status(200).json({ message: "Request sent to manager" });
  } catch (error) {
    console.error("Error handling change request:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.approvePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;

    console.log("📢 Approving Price for ID:", id, "New Price:", newPrice);

    const item = await InventoryItem.findById(id);
    if (!item) {
      console.error("❌ Inventory item not found");
      return res.status(404).json({ message: "Inventory item not found" });
    }

    console.log("🔍 Before Update:", item);

    item.basePrice = newPrice;
    item.suggestedPrice = null;
    await item.save();

    console.log("✅ After Update:", await InventoryItem.findById(id)); // Check if update persisted

    // **Fetch the latest inventory from MongoDB**
    const updatedInventory = await InventoryItem.find();

    res.json({ message: "Price approved successfully", updatedInventory });
  } catch (error) {
    console.error("❌ Error approving price:", error);
    res.status(500).json({ message: "Server error" });
  }
};