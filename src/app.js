import express from 'express';
import { validateEnv, env } from './config/env.js';
import { connectDB } from './config/database.js';
import { createRedisClient } from './config/redis.js';
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

export let redisClient;

const startServer = async () => {
  try {
    
    // Connect to database
    connectDB();

    // Connect to redis
    redisClient = await createRedisClient();

    // Start server
    const port = env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });

    // Log OAuth URL for testing
    const authUrl = generateAuthUrl();
    console.log("Auth URL: " + authUrl);
    
  } catch (err) {

    console.log("Cannot start server: "+err.message)
  
  }
}

startServer();

// Endpoint to serve static frontend page
app.get('/', (req, res) => {

  res.sendFile('index.html', { root: 'public' });

});
