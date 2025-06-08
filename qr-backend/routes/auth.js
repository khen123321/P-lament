// routes/auth.js

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/signup
router.post('/signup', signup);

// POST /api/login
router.post('/login', login);

// GET /api/profile — Protected route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user); // includes .points
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
