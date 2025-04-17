const User = require('../models/User');
const express = require('express');
const router = express.Router();
const passport = require('passport');


const authenticate = passport.authenticate('jwt', { session: false });

router.post('/search', authenticate, async (req, res) => {
  try {
    const { user } = req.body;

    const matchedUsers = await User.find({
      name: { $regex: user, $options: 'i' } // case-insensitive partial match
    });

    if (matchedUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    
    res.status(200).json({ users: matchedUsers });
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

module.exports = router;