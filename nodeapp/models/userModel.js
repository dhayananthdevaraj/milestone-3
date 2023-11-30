const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true, // Ensures usernames are unique
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
  role: {
    type: String,
    required: [true, 'Please enter a role'],
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
