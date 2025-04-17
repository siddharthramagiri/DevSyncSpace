
const express = require('express');
const passport = require('passport');
const { google } = require('googleapis');
const Event = require('../models/Event');
const User = require('../models/User');
const router = express.Router();

// Auth middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Initialize Google Calendar API
const getGoogleCalendar = async (user) => {
  if (!user.googleTokens || !user.googleTokens.accessToken) {
    throw new Error('Google Calendar access not available');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: user.googleTokens.accessToken,
    refresh_token: user.googleTokens.refreshToken
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
};

// Get all events for current user
router.get('/', authenticate, async (req, res) => {
  try {
    // Fetch events where user is organizer or participant
    const events = await Event.find({
      $or: [
        { organizer: req.user._id },
        { 'participants.user': req.user._id }
      ]
    }).populate('organizer', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('project', 'name');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Create a new event
router.post('/', authenticate, async (req, res) => {
  try {
    const { 
      title, description, startDate, endDate, 
      allDay, location, participants, project,
      addToGoogleCalendar
    } = req.body;
    
    // Create event in our database
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      allDay: allDay || false,
      location,
      organizer: req.user._id,
      project,
      participants: participants ? participants.map(p => ({ user: p })) : []
    });
    
    // If requested, also create in Google Calendar
    if (addToGoogleCalendar && req.user.googleTokens) {
      try {
        const calendar = await getGoogleCalendar(req.user);
        
        const googleEvent = {
          summary: title,
          description,
          start: {
            dateTime: new Date(startDate).toISOString(),
            timeZone: 'UTC'
          },
          end: {
            dateTime: new Date(endDate).toISOString(),
            timeZone: 'UTC'
          },
          location
        };
        
        // Add attendees if there are participants
        if (participants && participants.length > 0) {
          const users = await User.find({ _id: { $in: participants } });
          googleEvent.attendees = users.map(user => ({ email: user.email }));
        }
        
        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: googleEvent,
          sendUpdates: 'all'
        });
        
        newEvent.googleEventId = response.data.id;
      } catch (googleError) {
        console.error('Google Calendar error:', googleError);
        // Continue without Google Calendar integration
      }
    }
    
    await newEvent.save();
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Update event participation status
router.patch('/:id/participation', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Find this user's participant entry
    const participantIndex = event.participants.findIndex(p => 
      p.user.toString() === req.user._id.toString()
    );
    
    if (participantIndex === -1) {
      return res.status(403).json({ message: 'You are not a participant in this event' });
    }
    
    // Update status
    event.participants[participantIndex].status = status;
    await event.save();
    
    // If there's a Google Calendar event, update status there too
    if (event.googleEventId && event.organizer.googleTokens) {
      try {
        const organizer = await User.findById(event.organizer);
        if (organizer && organizer.googleTokens) {
          const calendar = await getGoogleCalendar(organizer);
          // Unfortunately updating attendee status requires more complex API calls
          // This would be implemented in a production app
        }
      } catch (googleError) {
        console.error('Google Calendar error:', googleError);
      }
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating participation status', error: error.message });
  }
});

// Delete an event
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Only organizer can delete event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the event organizer can delete this event' });
    }
    
    // If there's a Google Calendar event, delete it there too
    if (event.googleEventId && req.user.googleTokens) {
      try {
        const calendar = await getGoogleCalendar(req.user);
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: event.googleEventId,
          sendUpdates: 'all'
        });
      } catch (googleError) {
        console.error('Google Calendar error:', googleError);
      }
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

module.exports = router;
