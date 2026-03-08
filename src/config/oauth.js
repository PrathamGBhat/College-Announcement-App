import { google } from 'googleapis';
import { env } from './env.js';

export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GMAIL_REDIRECT_URL
);

export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.settings.basic",
  "https://www.googleapis.com/auth/gmail.modify"
];

export const generateAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    prompt: "consent"
  });
};

export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
