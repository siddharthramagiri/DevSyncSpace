
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// JWT Strategy for API authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Create new user
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
        provider: 'google',
        googleTokens: {
          accessToken,
          refreshToken
        }
      });
      await user.save();
    } else {
      // Update tokens
      user.googleTokens = {
        accessToken,
        refreshToken
      };
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find primary email from GitHub profile
    const primaryEmail = profile.emails && profile.emails.find(email => email.primary) || 
                         profile.emails && profile.emails[0] || 
                         { value: `${profile.username}@github.com` };
    
    // Check if user already exists
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      // Create new user
      user = new User({
        githubId: profile.id,
        email: primaryEmail.value,
        name: profile.displayName || profile.username,
        avatar: profile.photos[0].value,
        provider: 'github',
        githubToken: accessToken
      });
      await user.save();
    } else {
      // Update token
      user.githubToken = accessToken;
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
