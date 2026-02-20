import express from 'express';
import { UserModel } from "../model/LabelModel.js";
import { gmail } from "../server.js";
import { createGmailLabel, deleteGmailLabel } from "../utils/labels.js";



export const labelRouter = express.Router();



// Simulate DB using JSON right now

// {labelName : {labelId: 123, filterId: 45}}

let filterObject = {};



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

    if (filterObject[labelName]) {

      console.log(`Label already exists`)
      res.status(400).json({
        message : "Bad Request",
        error : `Label already exists`
      });

    }

    // If it doesn't exist go ahead with creating the filter and label

    const createdLabel = await createGmailLabel(gmail, labelName, fromList); // Creates a label and filter in authenticated user's account and returns id of filter and label
    filterObject[labelName] = createdLabel;

    console.log('Successfully created label. Updated filterObject:');
    console.log(filterObject);

    res.status(201).json({
      message : "Created",
      response : `Successfully created label ${labelName}`
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

    const response = await gmail.users.labels.list({
      userId : 'me'
    });
    const labelNames = response.data.labels.map(label => label.name);
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

    const labelId = filterObject[labelName].labelId;

    if (!labelId){
    
      console.log('labelId not found');
      res.status(404).json({
        message : "Not Found",
        error : 'labelId not found'
      });
    
    }

    const filterId = filterObject[labelName].filterId;
    
    if (!filterId){

      console.log('filterId not found');
      res.status(404).json({
        message : "Not Found",
        error : 'filterId not found'
      });

    }

    await deleteGmailLabel(gmail, labelId, filterId);
    delete filterObject[labelName];

    console.log('Successfully deleted filter. Updated filterObject:');
    console.log(filterObject);
    res.status(201).json({
      message : "Created",
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