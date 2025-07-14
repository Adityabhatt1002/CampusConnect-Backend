// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty'],
    required: true
  },
  // Additional fields specific to student/faculty can go here
  resetToken:String,
  resetTokenExpiry: Date,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
