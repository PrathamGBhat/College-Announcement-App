import express from 'express';
import { createNewLabel, getLabels, getEmailsByLabel, deleteLabel } from "../controllers/labelController.js";

export const labelRouter = express.Router();

// Endpoint to create filters with request body
labelRouter.post('/api/labels/create', createNewLabel);

// Endpoint for frontend to know what labels have been made by user
labelRouter.get('/api/labels/list', getLabels);

// Endpoint for frontend to retrieve mails from the backend with queries
labelRouter.get('/api/labels/:labelName', getEmailsByLabel);

// Endpoint for frontend to delete filters with req parameters
labelRouter.delete('/api/labels/delete/:labelName', deleteLabel);