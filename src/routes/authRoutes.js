import express from 'express';
import { handleOAuthCallback } from '../controllers/authController.js';

export const authRouter = express.Router();

// After login, callback exchanges code for tokens and redirects to home.
authRouter.get('/callback', handleOAuthCallback);
