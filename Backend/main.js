import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { google } from 'googleapis';
import { createGmailLabel, deleteGmailLabel } from './label_ops.js';
import retrieveMails from './mail_retriever.js';



// Setting up server

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
app.use(express.json())
app.use(express.static('public')); 
const router = express.Router();
app.use(router);



// Initializing the oauth2Client

const oauth2Client = new google.auth.OAuth2( 
process.env.GOOGLE_CLIENT_ID,
process.env.GOOGLE_CLIENT_SECRET,
process.env.GMAIL_REDIRECT_URL // The redirect url must be a globally visible url and also authorised in the google cloud platform- for testing with localhost, use ngrok
);



// Generates URL for login, logs it on console, extracts tokens from url when login and hence callback occurs

const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.settings.basic",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://www.googleapis.com/auth/gmail.modify"
];
const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // Keeps user logged in even when offline
    scope: scopes,
    prompt: "consent" // Any url generated with this will ask users for consent for the scopes specified
});

console.log(url); // Make sure the url is not breaking across lines // Add the gmail you're testing with as a test user in gcp

const gmail = google.gmail({version : 'v1', auth : oauth2Client});



// Simulate DB using JSON right now

let filterObject = {};



// After login, the callback url will exchange code for tokens, set oauth2Client with them and then redirect the user to home page

router.get('/callback', async (req, res) => {

  const code = req.query.code;
  const {tokens} = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log('CLIENT TOKENS SUCCESSFULLY SET');

  res.redirect('/');

});



// Endpoint for frontend to know what labels have been made by user

router.get('/api/labels', async (req,res) => {
  
  const response = await gmail.users.labels.list({
    userId : 'me'
  });
  const labelNames = response.data.labels.map(label => label.name);
  res.status(200).json({response: labelNames});

})



// Endpoint to create filters with request body

router.post('/api/create-label', async (req,res) => {

  try {

    const {labelName, fromList} = req.body;

    if (!labelName || !fromList) {
      console.log("Both labelName and fromList required in request body")
      res.status(400).json({error : 'Both labelName and fromList required in request body'});
    }

    // Check if label already exists

    if (filterObject[labelName]) {
      console.log(`Label already exists`)
      res.status(400).json({error : `Label already exists`});
    }

    // If it doesn't exist go ahead with creating the filter and label

    const createdLabel = await createGmailLabel(gmail, labelName, fromList); // Creates a label and filter in authenticated user's account and returns id of filter
    filterObject[labelName] = createdLabel;

    console.log('Successfully created label. Updated filterObject:');
    console.log(filterObject);

    res.status(201).json({response : `Successfully created label ${labelName}`});
    
  } catch (err) {
    
    console.log("Error : "+err.message);
    res.status(500).json({error : "Internal server error"});

  }
})



// Endpoint for frontend to delete filters with req parameters

router.delete('/api/delete-label/:labelName', async (req,res) => {

  try{

    const labelName = req.params.labelName;

    if (!labelName){
      console.log("Missing labelName in request parameters")
      res.status(400).json({error : 'Missing labelName in request parameters'})
    };

    const labelId = filterObject[labelName].labelId;
    const filterId = filterObject[labelName].filterId;
    
    if (!filterId){
      console.log('filterId not found');
      res.status(404).json({error : 'filterId not found'});
    }

    await deleteGmailLabel(gmail, labelId, filterId);
    delete filterObject[labelId];

    console.log('Successfully deleted filter. Updated filterObject:');
    console.log(filterObject);

    res.status(201).json({response : `Successfully deleted label ${labelName}`})
  
  } catch (err) {

    console.log("Error : "+err.message);
    res.status(500).json({error : "Internal server error"})

  }

});



// Endpoint for frontend to retrieve mails from the backend with queries

router.get('/api/emails', async (req,res)=>{

  try {

    const {labelName} = req.query; // fetch in frontend using /emails?labelName=CSE
    if (!labelName) return res.status(400).json({error : 'Missing query labelName'})
    
    let labelId = filterObject[labelName].labelId;

    const res_obj = await retrieveMails(gmail, labelId); // subject -> link
    
    res.status(200).json({response : res_obj});

  } catch (err) {

    console.log("Error : " + err.message);
    res.status(500).json({error : err.message});

  }

});



// Endpoint to serve static frontend page

router.get('/', (req,res) => {

  res.sendFile('index.html', {root: 'public'});

});