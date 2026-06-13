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

  section: {
    type: String,
    default: "",
  },

  closingDate: {
    type: String,
    default: "",
  },

  gear: {
  type: String,
  default: "",
},
year: {
  type: String,
  default: "2025-26",
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

module.exports = mongoose.model(
  "Failure",
  failureSchema
);