const mongoose = require('mongoose');

const bootcampSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    enum: ["web development", "ux/ui design", "data & analytics"],
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bootcamp", bootcampSchema);