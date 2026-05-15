import express from 'express';
import session from 'express-session';
import { validateEnv, env } from './config/env.js';
import { connectDB } from './config/database.js';
import { passport } from './config/auth.js';
import { attachGmailClient } from './middleware/authMiddleware.js';
import { authRouter } from './routes/authRoutes.js';
import { labelRouter } from './routes/labelRoutes.js';

// -----
// SERVER SETUP
// -----

// Validate environment variables
validateEnv();

// Set up express app
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Set up session management
app.use(session({
  secret: env.SESSION_SECRET,
  cookie: {
    secure: env.NODE_ENV === 'production',
    httpOnly : true,
    sameSite : 'lax',
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
  },
  resave: false,
  saveUninitialized: false,
}));

// Set up passport for google oauth sign in
app.use(passport.initialize());
app.use(passport.session());

// Set up routers and middleware
app.use(authRouter);
app.use(attachGmailClient);
app.use(labelRouter);

// -----
// INITIALIZE SERVER
// -----

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

// Endpoint to render index.html as home page
app.get('/',(req,res)=>{
  res.sendFile('public/index.html', { root: process.cwd() });
})