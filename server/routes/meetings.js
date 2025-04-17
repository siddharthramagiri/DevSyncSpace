
const express = require('express');
const passport = require('passport');
const Meeting = require('../models/Meeting');
const router = express.Router();

// Auth middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Get all meetings
router.get('/', authenticate, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { host: req.user._id },
        { 'participants.user': req.user._id }
      ]
    }).populate('host', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('project', 'name');
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings', error: error.message });
  }
});

// Get a specific meeting by room ID
router.get('/room/:roomId', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId })
      .populate('host', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('project', 'name');
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meeting', error: error.message });
  }
});

// Create a new meeting
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, startTime, endTime, project } = req.body;
    
    // Generate a unique room ID
    const roomId = Math.random().toString(36).substring(2, 8);
    
    const newMeeting = new Meeting({
      title,
      description,
      roomId,
      startTime,
      endTime,
      host: req.user._id,
      project,
      status: 'scheduled',
      participants: []
    });
    
    await newMeeting.save();
    
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating meeting', error: error.message });
  }
});

// Join a meeting
router.post('/join/:roomId', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId });
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Check if user is already in the meeting
    const participantIndex = meeting.participants.findIndex(p => 
      p.user.toString() === req.user._id.toString()
    );
    
    if (participantIndex === -1) {
      // Add user to participants
      meeting.participants.push({
        user: req.user._id,
        joinTime: new Date()
      });
    } else {
      // Update join time if they're rejoining
      meeting.participants[participantIndex].joinTime = new Date();
      // Clear leave time if they're rejoining
      meeting.participants[participantIndex].leaveTime = null;
    }
    
    // If meeting is scheduled and has host, change status to active
    if (meeting.status === 'scheduled') {
      meeting.status = 'active';
    }
    
    await meeting.save();
    
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error joining meeting', error: error.message });
  }
});

// Leave a meeting
router.post('/leave/:roomId', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId });
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Find participant
    const participantIndex = meeting.participants.findIndex(p => 
      p.user.toString() === req.user._id.toString()
    );
    
    if (participantIndex !== -1) {
      // Update leave time
      meeting.participants[participantIndex].leaveTime = new Date();
    }
    
    // If all participants have left and meeting is active, change status to completed
    const allLeft = meeting.participants.every(p => p.leaveTime);
    if (allLeft && meeting.status === 'active') {
      meeting.status = 'completed';
      meeting.endTime = new Date();
    }
    
    await meeting.save();
    
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error leaving meeting', error: error.message });
  }
});

// End a meeting (host only)
router.post('/:id/end', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Only host can end meeting
    if (meeting.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the host can end this meeting' });
    }
    
    meeting.status = 'completed';
    meeting.endTime = new Date();
    
    // Set leave time for all participants who haven't left
    meeting.participants.forEach(p => {
      if (!p.leaveTime) {
        p.leaveTime = new Date();
      }
    });
    
    await meeting.save();
    
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error ending meeting', error: error.message });
  }
});

module.exports = router;
