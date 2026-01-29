import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';
import express from 'express';
import retrieveMails from './mail_retriever'
import { createGmailFilter, deleteGmailFilter } from './filter_ops';



// Setting up server

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
const router = express.Router();
app.use(router);



// Simulate database using JSON right now

let filterObject = {};



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
console.log(url); // Make sure the url is not breaking across lines - copy paste into a notepad and remove all \n // Add the gmail you're testing with as a test user in gcp



// FIX NEEDED: Add all necessary endpoints and return correct response

// After login, the callback url will exchange code for tokens, set oauth2Client with them and then redirect the user to home page

router.get('/callback', async (req, res) => {

  const code = req.query.code;
  const {tokens} = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log('CLIENT TOKENS SUCCESSFULLY SET');

  res.redirect('/');

});



// Main page of web app

router.get('/emails', async (req,res)=>{

  try {

    const gmail = google.gmail({version:'v1',auth:oauth2Client}); // Create such clients only after authentication is complete

    let filter_list = await gmail.users.settings.filters.list({userId:'me'});
    let filterId = filter_list.data.filter[0].id;

    res.json(await retrieveMails(gmail, filterId));

  } catch (err) {

    console.error('Error fetching Gmail messages: '+err.message);
    res.status(500).send('Failed to fetch Gmail messages');

  }

});