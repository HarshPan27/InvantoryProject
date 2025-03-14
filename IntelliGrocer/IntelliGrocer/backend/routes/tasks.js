const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");

router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    // 🔍 Validate if `employeeId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      console.error(" Invalid employee ID format:", employeeId);
      return res.status(400).json({ error: "Invalid employee ID format" });
    }

    console.log("📢 Fetching tasks for Employee ID:", employeeId);

    const tasks = await Task.find({ assignedTo: employeeId });

    if (!tasks.length) {
      console.warn("⚠ No tasks found for Employee ID:", employeeId);
      return res.status(404).json({ message: "No tasks found for this employee." });
    }

    console.log(" Found tasks:", tasks);
    res.json(tasks);
  } catch (error) {
    console.error(" Error fetching tasks:", error);
    res.status(500).json({ message: "Server error fetching tasks", error });
  }
});
router.get("/", async (req, res) => {
    try {
      const tasks = await Task.find(); 
      res.json(tasks); 
    } catch (err) {
      console.error(" Error fetching tasks:", err);
      res.status(500).json({ error: "Server error fetching tasks" });
    }
  });
  router.patch("/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: "Invalid task ID format" });
      }
  
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status: "Completed" },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json({ message: "Task updated successfully!", updatedTask });
    } catch (error) {
      console.error(" Error updating task:", error);
      res.status(500).json({ message: "Error updating task", error });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title, description, assignedTo } = req.body;
  
      // 🔹 Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ error: "Invalid assignedTo ID format" });
      }
  
      const newTask = new Task({ title, description, assignedTo: new mongoose.Types.ObjectId(assignedTo), status: "Pending" });
  
      await newTask.save();
      res.json({ message: "Task assigned successfully!", task: newTask });
    } catch (error) {
      console.error(" Error assigning task:", error);
      res.status(500).json({ message: "Server error while assigning task", error });
    }
  });

module.exports = router;