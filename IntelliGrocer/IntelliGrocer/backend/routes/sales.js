const express = require("express");
const router = express.Router();
const SalesModel = require("../models/Sales");

// ✅ Route to update sales data
router.post("/update", async (req, res) => {
  try {
    const { totalRevenue } = req.body;
    if (!totalRevenue) {
      return res.status(400).json({ error: "Total revenue is required" });
    }

    // Log the request data
    console.log("📢 Sales Update Request:", req.body);

    // ✅ Save the sales data
    const newSale = new SalesModel({ totalRevenue, date: new Date() });
    await newSale.save();

    res.json({ message: "Sales updated successfully" });
  } catch (error) {
    console.error("❌ Error updating sales:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route to fetch sales analytics
router.get("/analytics", async (req, res) => {
  try {
    const sales = await SalesModel.find();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales data found" });
    }

    // ✅ Return valid JSON data
    res.json({
      dates: sales.map((sale) => sale.date.toISOString().split("T")[0]),
      revenues: sales.map((sale) => sale.totalRevenue),
    });
  } catch (error) {
    console.error("❌ Error fetching sales data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;