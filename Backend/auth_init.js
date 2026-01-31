import { google } from 'googleapis';

export async function oauth2ClientInit(){

    // Initializing the oauth2Client

    const oauth2Client = new google.auth.OAuth2( 
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URL // The redirect url must be a globally visible url and also authorised in the google cloud platform- for testing with localhost, use ngrok
    );

    // Generates URL for login, logs it on console, extracts tokens from url when login and hence callback occurs

    const scopes = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.settings.basic"
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline", // Keeps user logged in even when offline
        scope: scopes,
        prompt: "consent" // Any url generated with this will ask users for consent for the scopes specified
    });

    gmail = google.gmail({version : 'v1', auth : oauth2Client});

    return {oauth2Client, gmail, url}; 

}