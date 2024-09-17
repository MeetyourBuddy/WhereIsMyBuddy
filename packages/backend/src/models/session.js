const mongoose = require('mongoose');

// Define the Session model schema
const sessionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    expires_at: {
      type: Date,
      required: true
    }
  },
  { _id: false } // Disable automatic _id creation
);

// Create and export the Session model
const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
