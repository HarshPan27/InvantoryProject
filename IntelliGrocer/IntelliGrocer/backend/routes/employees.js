const express = require("express");
const router = express.Router();
const User = require("../models/User"); 


router.get("/", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password"); 
    res.json(employees);
  } catch (error) {
    console.error(" Error fetching employees:", error);
    res.status(500).json({ error: "Server error while fetching employees" });
  }
});


router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "employee" });
    res.json({ count });
  } catch (error) {
    console.error(" Error fetching employee count:", error);
    res.status(500).json({ error: "Server error while fetching employee count" });
  }
});
module.exports = router;