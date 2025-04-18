
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
  avatar: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Authentication fields
  provider: {
    type: String,
    enum: ['google', 'github', 'local'],
    required: true
  },
  googleId: String,
  githubId: String,
  password: String, // For local authentication (hashed)
  
  // OAuth tokens
  googleTokens: {
    accessToken: String,
    refreshToken: String
  },
  githubToken: String,
  
  // Profile info
  bio: String,
  company: String,
  jobTitle: String,
  location: String,
  phoneNumber: String,

  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // App usage
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
