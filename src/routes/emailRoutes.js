import express from 'express';
import { getEmailsByLabel } from "../controllers/emailController.js";

export const emailRouter = express.Router();

// Endpoint for frontend to retrieve mails from the backend with queries
emailRouter.get('/api/emails/:labelName', getEmailsByLabel);