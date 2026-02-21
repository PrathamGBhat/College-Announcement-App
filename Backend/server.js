// FIX NEEDED : Try using database instead of filterObject next then handle auth, session management with cookies and finally fix router

import express from 'express';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import { emailRouter } from './routes/emailRoutes.js';
import { labelRouter } from './routes/labelRoutes.js';


// Setting up server

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
app.use(express.json())
app.use(express.static('public'));
export const router = express.Router()
app.use(emailRouter);
app.use(labelRouter);
app.use(router)



// Setting up database

mongoose.connect(process.env.MONGODB_CONNECTION_URI)
  .then(()=>{
    console.log("Database connected successfully")
  })
  .catch(err => {
    console.error("Error: "+err.message)
  });



// Initializing the oauth2Client

const oauth2Client = new google.auth.OAuth2( 
process.env.GOOGLE_CLIENT_ID,
process.env.GOOGLE_CLIENT_SECRET,
process.env.GMAIL_REDIRECT_URL // The redirect url must be a globally visible url and also authorised in the google cloud platform- for testing with localhost, use ngrok
);



// Generates URL for login, logs it on console, extracts tokens from url when login and hence callback occurs

const scopes = [
    "https://www.googleapis.com/auth/gmail.settings.basic",
    "https://www.googleapis.com/auth/gmail.modify"
];
const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // Keeps user logged in even when offline
    scope: scopes,
    prompt: "consent" // Any url generated with this will ask users for consent for the scopes specified
});

console.log(url); // Make sure the url is not breaking across lines // Add the gmail you're testing with as a test user in gcp

export const gmail = google.gmail({version : 'v1', auth : oauth2Client});



// After login, the callback url will exchange code for tokens, set oauth2Client with them and then redirect the user to home page

router.get('/callback', async (req, res) => {

  try{

    const code = req.query.code;
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('CLIENT TOKENS SUCCESSFULLY SET');

    res.redirect('/');

  } catch (err) {

    console.log(err.message)
    res.status(500).json({
      message : "Internal server error",
      error : err.message
    })

  }

});



// Endpoint to serve static frontend page

router.get('/', (req,res) => {

  res.sendFile('index.html', {root: 'public'});

});