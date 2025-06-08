// routes/user.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust if needed
require('dotenv').config();

// Middleware to check token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = userData;
    next();
  });
};

// ✅ Profile endpoint (GET /api/user/profile)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); // Sends user data to frontend
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
