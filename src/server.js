// FIX NEEDED : Retrieve mails is all from database, try loading database every new load

import express from 'express';
import { validateEnv, env } from './config/env.js';
import { connectDB } from './config/database.js';
import { generateAuthUrl } from './config/oauth.js';
import { labelRouter } from './routes/labelRoutes.js';
import { authRouter } from './routes/authRoutes.js';

// Validate environment variables
validateEnv();

// Setting up server
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(labelRouter);
app.use(authRouter);
const port = env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Connect to database
connectDB();

// Log OAuth URL for testing
const authUrl = generateAuthUrl();
console.log("Auth URL: " + authUrl);

// Endpoint to serve static frontend page
app.get('/', (req, res) => {

  res.sendFile('index.html', { root: 'public' });

});
