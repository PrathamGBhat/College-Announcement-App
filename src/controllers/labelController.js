import { Label } from "../model/Label.js";
import { createGmailLabel, retrieveMails, deleteGmailLabel } from "../services/labels.js";

export async function createNewLabel(req,res) {

  try {

    const {labelName, fromList} = req.body;

    if (!labelName || !fromList) {

      console.log("Both labelName and fromList required in request body")
      return res.status(400).json({
        message : "Bad Request",
        error : 'Both labelName and fromList required in request body'
      });

    }

    let label = await Label.findOne({labelName : labelName})

    if (label != null) {

      console.log(`Label already exists`)
      return res.status(400).json({
        message : "Bad Request",
        error : `Label already exists`
      });

    }

    const {labelId, filterId} = await createGmailLabel(req.gmail, labelName, fromList);
    const createdLabel = new Label({
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
}

export async function getLabels(req,res) {

  try {

    const labels = await Label.find({});
    const labelNames = labels.map(label=>label.labelName);

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

}

export async function getEmailsByLabel(req,res){

  try {

    const {labelName} = req.params;

    if (!labelName){ 

      console.log("Missing parameter labelName")
      return res.status(400).json({
        message : "Bad Request",
        error : 'Missing parameter labelName'
      });
      
    }

    let label = await Label.findOne({labelName : labelName});

    if(!label){

      console.log("Couldn't find specified labelName in database");
      return res.status(404).json({
        message : "Not Found",
        error : "Couldn't find specified labelName in database"
      })

    }

    let labelId = label.labelId;
    const res_obj = await retrieveMails(req.gmail, labelId);
    
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

export async function deleteLabel(req,res) {

  try{

    const labelName = req.params.labelName;

    if (!labelName){
      
      console.log("Missing labelName in request parameters")
      return res.status(400).json({
        message : "Bad Request",
        error : 'Missing labelName in request parameters'
      });

    };

    const label = await Label.findOne({labelName : labelName});

    if (!label){
    
      console.log('Label not found');
      return res.status(404).json({
        message : "Not Found",
        error : 'Label not found'
      });
    
    }

    const labelId = label.labelId;
    const filterId = label.filterId;

    if (!labelId || !filterId){
      throw new Error("Neither labelId nor filterId can be empty")
    }

    await deleteGmailLabel(req.gmail, labelId, filterId);
    await Label.deleteOne({labelName : labelName});

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

}
