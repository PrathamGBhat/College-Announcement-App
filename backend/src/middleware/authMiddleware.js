import { google } from 'googleapis';
import { env } from '../config/env.js';

export const attachGmailClient = (req, res, next) => {

  // Handle unauthorized requests
  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthorized',
      error: 'Not logged in'
    });
  }

  // Attach gmail client to authorized users requests
  if (!req.gmail) {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_CALLBACK_URL
    );
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });
    req.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  next();
};
