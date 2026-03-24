import express from 'express';
import session from 'express-session';
import { passport } from './config/auth.js';
import { validateEnv, env } from './config/env.js';
import { connectDB } from './config/database.js';
import { authRouter } from './routes/authRoutes.js';
import { attachGmailClient } from './middleware/authMiddleware.js';
import { labelRouter } from './routes/labelRoutes.js';

// Validate environment variables
validateEnv();

// Setting up server
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly : true,
    sameSite : 'lax',
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
  },
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(attachGmailClient);
app.use(labelRouter);

// Function to initialize web app and start server
const startServer = async () => {
  try {
    
    // Connect to database
    connectDB();

    // Start server
    const port = env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
    
  } catch (err) {

    console.log("Cannot start server: "+err.message)
  
  }
}

startServer();

// Endpoint to serve static frontend page
app.get('/', (req, res) => {

  res.sendFile('index.html', { root: 'public' });

});
