import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { oauth2ClientInit } from './auth_init.js';
import { createGmailFilter, deleteGmailFilter } from './filter_ops.js';
import retrieveMails from './mail_retriever.js';



// Setting up server

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
app.use(express.static('public')); 
const router = express.Router();
app.use(router);



// Initialising google clients and login url

const {oauth2Client, gmail, url} = await oauth2ClientInit(); // Returns the oauth2Client instance, gmail client instance and login url
console.log(url); // Make sure the url is not breaking across lines // Add the gmail you're testing with as a test user in gcp



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



// Endpoint for frontend to know what filters have been made by user

router.get('/filters', (req,res) => {
  
  res.json(Object.keys(filterObject)); // DB

})



// Endpoint to create filters

router.post('/create-filter', async (req,res) => {

  try {

    const {filterName, filterList} = req.body;

    if (!filterName || !filterList) {
      return res.status(400).json({ error: 'filterName and filterList are required' });
    }

    const filterId = await createGmailFilter(gmail, filterList);
    filterObject[filterName] = filterId;

    res.status(201).json({message : 'Successfully created filter'})

  } catch (err) {
    
    console.log("Error : ", err.message);
    res.status(500).json({error : 'Could not create filter'});

  }
})



// FIX NEEDED: fix the delete endpoint and delete filter function in filter ops later

// Endpoint for frontend to delete filters

router.delete('/filter/:filterName', async (req,res) => {

});

// Endpoint for frontend to retrieve mails from the backend 

router.get('/emails', async (req,res)=>{

  try {

    const {filterName} = req.query; // fetch in frontend using /emails?filterName=CSE
    if (!filterName) return res.status(400).json({error : 'Missing query filterName'})
    
    const filterId = filterObject[filterName]; // DB
    if (!filterId) return res.status(404).json({error : 'Resource filterId not found in database'})

    res.json(await retrieveMails(gmail, filterId));

  } catch (err) {

    console.log("Error : " + err.message);
    res.status(500).json({error : 'Internal server error'});

  }

});



// Endpoint to serve static frontend page

router.get('/', (req,res) => {

  res.sendFile('index.html', {root: 'public'}); // Search for folder called public in the root is what it means// To make sure root works properly, the node command should only be given from "Gmail Reader/"

});