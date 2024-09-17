const mongoose = require('mongoose');

// Define the User model schema
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    }
  },
  { _id: false } // Disable automatic _id creation
);

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
