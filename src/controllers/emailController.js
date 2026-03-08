import { Label } from "../model/Label.js";
import { gmail } from "../config/oauth.js";
import retrieveMails from '../services/emails.js';

export async function getEmailsByLabel(req,res){

  try {

    const {labelName} = req.params;

    if (!labelName){ 

      console.log("Missing parameter labelName")
      res.status(400).json({
        message : "Bad Request",
        error : 'Missing parameter labelName'
      });
      
    }
    
    let label = await Label.findOne({labelName : labelName});

    if(!label){

      console.log("Couldn't find specified labelName in database");
      res.status(404).json({
        message : "Not Found",
        error : "Couldn't find specified labelName in database"
      })

    }

    let labelId = label.labelId;

    const res_obj = await retrieveMails(gmail, labelId);
    
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

}
