import express from 'express';
import { LabelModel } from "../model/LabelModel.js";
import { gmail } from "../server.js";
import { createGmailLabel, deleteGmailLabel } from "../utils/labels.js";

export const labelRouter = express.Router();

// Endpoint to create filters with request body

labelRouter.post('/api/create-label', async (req,res) => {

  try {

    const {labelName, fromList} = req.body;

    if (!labelName || !fromList) {

      console.log("Both labelName and fromList required in request body")
      res.status(400).json({
        message : "Bad Request",
        error : 'Both labelName and fromList required in request body'
      });

      return;

    }

    // Check if label already exists

    let label = await LabelModel.findOne({labelName : labelName})

    if (label != null) {

      console.log(`Label already exists`)
      res.status(400).json({
        message : "Bad Request",
        error : `Label already exists`
      });

    }

    // If it doesn't exist go ahead with creating the filter and label

    const {labelId, filterId} = await createGmailLabel(gmail, labelName, fromList); // Creates a label and filter in authenticated user's account and returns id of filter and label
    const createdLabel = new LabelModel({
      labelName,
      labelId,
      filterId
    });
    await createdLabel.save();

    console.log('Successfully created label');
    res.status(201).json({
      message : "Created",
      data : `Successfully created label ${labelName}`
    });
    
  } catch (err) {
    
    console.log(err.message);
    res.status(500).json({
      message : "Internal server error",
      error : err.message
    });


  }
})



// Endpoint for frontend to know what labels have been made by user

labelRouter.get('/api/labels', async (req,res) => {

  try {

    const labels = await LabelModel.find({});
    const labelNames = labels.map(label => label.labelName);

    console.log("Retrieved all labels created by user")
    res.status(200).json({
      message : "OK",
      data: labelNames
    });

  } catch (err) {

    console.log(err.message);
    res.status(500).json({
      message : "Internal server error",
      error : err.message
    });

  }

})



// Endpoint for frontend to delete filters with req parameters

labelRouter.delete('/api/delete-label/:labelName', async (req,res) => {

  try{

    const labelName = req.params.labelName;

    if (!labelName){
      
      console.log("Missing labelName in request parameters")
      res.status(400).json({
        message : "Bad Request",
        error : 'Missing labelName in request parameters'
      });

      return;
    };

    const label = await LabelModel.findOne({labelName : labelName});

    if (!label){
    
      console.log('Label not found');
      res.status(404).json({
        message : "Not Found",
        error : 'Label not found'
      });
    
    }

    const labelId = label.labelId;
    const filterId = label.filterId;

    if (!labelId || !filterId){
      throw new Error("Neither labelId nor filterId can be empty")
    }

    await deleteGmailLabel(gmail, labelId, filterId);
    await LabelModel.deleteOne({labelName : labelName});

    console.log('Successfully deleted label');
    res.status(201).json({
      message : "Deleted",
      data : `Successfully deleted label ${labelName}`
    })
  
  } catch (err) {

    console.log(err.message);
    res.status(500).json({
      message : "Internal server error",
      error : err.message
    });

  }

});