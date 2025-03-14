const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  shifts: [
    {
      shiftStart: { type: Date, required: true },
      shiftEnd: { type: Date, required: true },
      notes: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("Schedule", ScheduleSchema);