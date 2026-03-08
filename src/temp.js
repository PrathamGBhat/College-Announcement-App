// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import { google } from 'googleapis';

// // Setting up server

// const app = express();
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });
// app.use(express.json());
// app.use(express.static('public')); 
// const router = express.Router();
// app.use(router);

// // Initializing the oauth2Client

// const oauth2Client = new google.auth.OAuth2( 
// process.env.GOOGLE_CLIENT_ID,
// process.env.GOOGLE_CLIENT_SECRET,
// process.env.GMAIL_REDIRECT_URL // The redirect url must be a globally visible url and also authorised in the google cloud platform- for testing with localhost, use ngrok
// );

// // Generates URL for login, logs it on console, extracts tokens from url when login and hence callback occurs

// const scopes = [
//     "https://www.googleapis.com/auth/gmail.readonly",
//     "https://www.googleapis.com/auth/gmail.settings.basic",
//     "https://www.googleapis.com/auth/gmail.labels"
// ];
// const url = oauth2Client.generateAuthUrl({
//     access_type: "offline", // Keeps user logged in even when offline
//     scope: scopes,
//     prompt: "consent" // Any url generated with this will ask users for consent for the scopes specified
// });

// console.log(url); // Make sure the url is not breaking across lines // Add the gmail you're testing with as a test user in gcp

// const gmail = google.gmail({version : 'v1', auth : oauth2Client});

// router.get('/callback', async (req, res) => {

//   const code = req.query.code;
//   const {tokens} = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);
//   console.log("Client tokens successfully set")

//   // Modify below this line

//   const response = await gmail.users.messages.list({
//     userId : 'me',
//     maxResults : 5
//   });
//   const msgIdsList = response.data.messages.map(msg => msg.id);
//   res.json(msgIdsList);

//   // Modify above this line

// });


// async function createFilter(){
//   await fetch('https://nonflexible-graeme-bionomical.ngrok-free.dev/api/create-label', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       labelName: 'RVCE',
//       fromList: ['*rvce.edu.in']
//     })
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// }

// async function fetchEmails(){
//   await fetch('https://nonflexible-graeme-bionomical.ngrok-free.dev/api/emails?labelName=RVCE')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
// }

// async function deleteFilter(){  
//   await fetch('https://nonflexible-graeme-bionomical.ngrok-free.dev/api/delete-label/RVCE', {
//     method: 'DELETE',
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// }

// await createFilter()
// await fetchEmails()
// await deleteFilter()

// import dotenv from 'dotenv'
// dotenv.config();

// const url = process.env.MONGODB_CONNECTION_URI
// console.log(url);

// import crypto from "crypto";
// console.log(crypto.randomBytes(64).toString('hex'));