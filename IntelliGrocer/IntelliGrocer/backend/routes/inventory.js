const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Ensure all controller functions are correctly imported
if (!inventoryController.getAllItems || !inventoryController.createItem) {
  throw new Error("Missing inventoryController functions. Check the import.");
}

// GET all inventory items (Employee & Manager)
router.get("/", inventoryController.getAllItems);

// POST new inventory item (Manager only)
router.post("/", inventoryController.createItem);

// Handle change requests from employees
router.post("/request-change", inventoryController.requestChange);

router.put("/:id", inventoryController.updateItem);
module.exports = router;