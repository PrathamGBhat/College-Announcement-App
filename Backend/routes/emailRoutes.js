import express from 'express';
import { LabelModel } from "../model/LabelModel.js";
import { gmail } from "../server.js";
import retrieveMails from '../utils/emails.js';

export const emailRouter = express.Router();

// Endpoint for frontend to retrieve mails from the backend with queries

emailRouter.get('/api/emails', async (req,res)=>{

  try {

    const {labelName} = req.query; // fetch in frontend using /emails?labelName=CSE

    if (!labelName){ 

      console.log("Missing query parameter labelName")
      res.status(400).json({
        message : "Bad Request",
        error : 'Missing query labelName'
      });
      
    }
    
    let label = await LabelModel.findOne({labelName : labelName});

    if(!label){

      console.log("Couldn't find specified labelName in database");
      res.status(404).json({
        message : "Not Found",
        error : "Couldn't find specified labelName in database"
      })

    }

    let labelId = label.labelId;

    const res_obj = await retrieveMails(gmail, labelId); // {subject -> link}
    
    console.log("Successfully retrieved emails")
    res.status(200).json({
      message : "OK",
      data : res_obj
    });

  } catch (err) {

    console.log(err.message);
    res.status(500).json({
      message : "Internal server error",
      error : err.message
    });

  }

});