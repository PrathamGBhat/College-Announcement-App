import express from 'express';
import { createNewLabel, getLabels, deleteLabel } from "../controllers/labelController.js";

export const labelRouter = express.Router();

// Endpoint to create filters with request body
labelRouter.post('/api/create-label', createNewLabel);

// Endpoint for frontend to know what labels have been made by user
labelRouter.get('/api/labels', getLabels);

// Endpoint for frontend to delete filters with req parameters
labelRouter.delete('/api/delete-label/:labelName', deleteLabel);