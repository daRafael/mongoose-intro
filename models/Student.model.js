const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String
  },
  img: {
    type: String,
    default: 'https://via.placeholder.com//150'
  },
  age: {
    required: true,
    type: Number
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp'
  }
});

module.exports = mongoose.model('Student', studentSchema);