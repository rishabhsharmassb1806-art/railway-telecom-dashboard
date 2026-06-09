const mongoose = require("mongoose");

const failureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    default: "Low",
  },
  status: {
    type: String,
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Failure", failureSchema);