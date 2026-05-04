import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { validateEnv, env } from './config/env.js';
import { connectDB } from './config/database.js';
import { passport } from './config/auth.js';
import { attachGmailClient } from './middleware/authMiddleware.js';
import { authRouter } from './routes/authRoutes.js';
import { labelRouter } from './routes/labelRoutes.js';

// Validate environment variables
validateEnv();

// Setting up server
const app = express();
app.use(express.json());
// app.use(express.static('./frontend/public'));
app.set('trust proxy', 1);
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [env.FRONTEND_URL].filter(Boolean)
  : [env.FRONTEND_URL, 'http://localhost:5500'].filter(Boolean);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(session({
  secret: env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly : true,
    sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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