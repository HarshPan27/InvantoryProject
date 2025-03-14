const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalRevenue: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Sales", SalesSchema);