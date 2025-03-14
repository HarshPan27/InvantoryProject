const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const scheduleController = require("../controllers/scheduleController");



router.post("/assign", scheduleController.assignSchedule);

// ✅ Get Employee Schedule
router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log("📢 Fetching schedule for:", employeeId);

    const schedule = await Schedule.find({ employeeId });
    if (!schedule.length) {
      return res.status(404).json({ error: "Schedule not found for this employee." });
    }

    res.json(schedule);
  } catch (error) {
    console.error(" Error fetching schedule:", error);
    res.status(500).json({ error: "Server error while fetching schedule" });
  }
});

  

  router.post("/", async (req, res) => {
    try {
      console.log("📢 Schedule request received:", req.body); 
  
      const { employeeId, shiftStart, shiftEnd, notes } = req.body;
  
      if (!employeeId || !shiftStart || !shiftEnd) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const employee = await User.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      const newSchedule = new Schedule({
        employeeId,
        employeeName: employee.username,
        shiftStart,
        shiftEnd,
        notes,
      });
  
      await newSchedule.save();
      console.log(" Schedule saved successfully:", newSchedule); 
  
      res.status(201).json({ message: "Schedule created successfully", newSchedule });
    } catch (err) {
      console.error(" Error creating schedule:", err);
      res.status(500).json({ error: "Server error while creating schedule" });
    }
  });
  

// ✅ Delete a schedule (Manager only)
router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted successfully" });
  } catch (err) {
    console.error(" Error deleting schedule:", err); 
    res.status(500).json({ error: "Server error while deleting schedule" });
  }
});

module.exports = router;