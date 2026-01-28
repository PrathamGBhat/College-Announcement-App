import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';
import express from 'express';



// Setting up server

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
const router = express.Router();
app.use(router);



// Initializing the oauth2Client

const oauth2Client = new google.auth.OAuth2( 
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL // The redirect url must be a globally visible url and also authorised in the google cloud platform- for testing with localhost, use ngrok
);
google.options({auth : oauth2Client}); // Sets any auth parameter requirement to refer to this oauth2Client



// Generates URL for login, logs it on console, extracts tokens from url when login and hence callback occurs

const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly"
  ];
const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // Keeps user logged in even when offline
    scope: scopes,
    prompt: "consent" // Any url generated with this will ask users for consent for the scopes specified
});
console.log(url); // Make sure the url is not breaking across lines - copy paste into a notepad and remove all \n // Add the gmail you're testing with as a test user in gcp



// After login, the callback url will handle gmail retrieval

router.get('/callback', async (req, res) => {

  const code = req.query.code;
  const {tokens} = await oauth2Client.getToken(code); // Exchanges code for tokens
  oauth2Client.setCredentials(tokens);
  console.log('CLIENT TOKENS SUCCESSFULLY SET');

  try {
    const gmail = google.gmail('v1');

    const response = await gmail.users.messages.list({userId: 'me', maxResults:10}); // Holds the response from google api request
    const msgIdsList = response.data.messages; // any api response from google is wrapped in a .data // Only holds the id and thread id of messages, not the body 
    
    const subject_links={}; // Object that holds subjects mapped to their links

    for (let msgIds of msgIdsList){

      // Obtaining the message headers

      const msgObj = await gmail.users.messages.get({userId: 'me', id: msgIds.id})
      const headers = msgObj.data.payload.headers;  // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages#Message 
                                                    // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages#Message.MessagePart

      // Creating the object having subjects mapped to links

      let link, subject, email;

      for (let header of headers){
        
        if (header.name=='Subject'){
          subject = `${header.value}`;
        }
        if (header.name=='Delivered-To'){
          email=`${header.value}`;
        }
      }

      link=`https://mail.google.com/mail/?email=${email}#inbox/${msgIds.id}`;
      subject_links[subject]=link;

    }

    // Returning the object

    res.json(subject_links);

  } catch (err) {
    console.error('Error fetching Gmail messages: '+err.message);
    res.status(500).send('Failed to fetch Gmail messages');
  }

});