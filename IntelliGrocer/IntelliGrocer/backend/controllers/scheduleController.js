const Schedule = require("../models/Schedule");
const User = require("../models/User");
// ✅ Create or Update Schedule for Employee
exports.assignSchedule = async (req, res) => {
    try {
      console.log("📢 Received schedule assignment request:", req.body); // Debug log
  
      const { employeeId, shiftStart, shiftEnd, notes } = req.body;
  
      if (!employeeId || !shiftStart || !shiftEnd) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Check if the employee exists
      const employee = await User.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      // Create a new schedule
      const newSchedule = new Schedule({
        employeeId,
        employeeName: employee.username, // Assuming username exists in User model
        shiftStart,
        shiftEnd,
        notes,
      });
  
      await newSchedule.save();
  
      console.log("✅ Schedule assigned successfully:", newSchedule); // Debug log
      res.status(201).json({ message: "Schedule assigned successfully", newSchedule });
    } catch (err) {
      console.error("❌ Error assigning schedule:", err);
      res.status(500).json({ error: "Server error while assigning schedule" });
    }
  };

  exports.getSchedule = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({ error: "Missing employee ID in request." });
        }

        console.log("🔍 Fetching schedule for employee ID:", employeeId);

        const schedule = await Schedule.findOne({ employeeId });

        if (!schedule || !schedule.shifts.length) {
            console.warn("⚠ No schedule found for employee ID:", employeeId);
            return res.status(404).json({ error: "Schedule not found for this employee." });
        }

        res.json(schedule.shifts); // ✅ Return only the shifts array
    } catch (error) {
        console.error("❌ Error fetching schedule:", error);
        res.status(500).json({ error: "Server error while fetching schedules" });
    }
};