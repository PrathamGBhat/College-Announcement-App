import express from 'express';
import { passport } from '../config/auth.js';

export const authRouter = express.Router();

// Endpoint to login with oauth
authRouter.get('/auth/google/login', passport.authenticate('google', { scope: ['profile', 'email','https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/gmail.settings.basic'] }));

// Endpoint used by oauth to manage tokens
authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google/login' }), (req, res) => {
    res.redirect('/');
});

// Endpoint to get current user profile
authRouter.get('/auth/profile', (req, res) => {

  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthorized',
      error: 'Not logged in'
    });
  }
  
  res.status(200).json({
    message: 'OK',
    data: {
      name: req.user.name,
      email: req.user.email
    }
  });

});

// Endpoint to logout
authRouter.get('/auth/google/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destroy failed', error: err.message });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

