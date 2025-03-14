const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // ✅ Ensure email is here!
  password: { type: String, required: true },
  role: { type: String, enum: ["manager", "employee", "shopper"], required: true },
  employeeId: { type: String, unique: false },
});



module.exports = mongoose.model("User", UserSchema);