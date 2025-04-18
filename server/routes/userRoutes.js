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

    // console.log(matchedUsers)
    res.status(200).json({ users: matchedUsers });
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

router.put('/update/:id', async(req, res) => {
  console.log("Recieving")
  try {
    console.log(req.body);
    
    const {
      company,
      jobTitle,
      location,
      phone,
      githubId
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        company : company,
        jobTitle : jobTitle,
        location : location,
        phoneNumber : phone,
        githubId : githubId,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if(!updatedUser) {
      return res.status(404).json({ message: 'User Not found' });
    }

    res.status(200).json({
      message: "User details updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({message: 'Error Updating Details', error: error.message})
  } 
})


router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleTokens -githubToken');
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to get user", error: err.message });
  }
})

router.get('/:id', async(req, res) => {
  
  try {
    
    const user = await User.findById(req.params.id)
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to get user", error: err.message });
  }
})


router.put('/follow/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const userToFollowId = req.params.userId;
    
    console.log(currentUserId)
    console.log(userToFollow)

    if (currentUserId === userToFollowId) {
      return res.status(400).json({ message: "You can't follow yourself!" });
    }

    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userToFollowId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    if (currentUser.team.includes(userToFollowId)) {
      return res.status(400).json({ message: 'User already in your team' });
    }

    currentUser.team.push(userToFollowId);
    await currentUser.save();

    res.status(200).json({ message: 'User added to your team successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding user to team', error: err.message });
  }
});


module.exports = router;