import { createGmailLabel, getAllLabelsFromGmail, retrieveMails, deleteGmailLabel } from "../services/labels.js";

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

    // Check if label already exists in Gmail
    const gmailLabels = await getAllLabelsFromGmail(req.gmail);
    const existingLabel = gmailLabels.find(l => l.labelName === labelName);

    if (existingLabel) {

      console.log(`Label already exists`)
      return res.status(400).json({
        message : "Bad Request",
        error : `Label already exists`
      });

    }

    const {labelId, filterId} = await createGmailLabel(req.gmail, labelName, fromList);

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

    const labels = await getAllLabelsFromGmail(req.gmail);
    const labelNames = labels.map(label=>label.labelName);

    console.log("Retrieved all labels from Gmail")
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

    const labels = await getAllLabelsFromGmail(req.gmail);
    const label = labels.find(l => l.labelName === labelName);

    if(!label){

      console.log("Couldn't find specified labelName in Gmail");
      return res.status(404).json({
        message : "Not Found",
        error : "Couldn't find specified labelName in Gmail"
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

    const labels = await getAllLabelsFromGmail(req.gmail);
    const label = labels.find(l => l.labelName === labelName);

    if (!label){
    
      console.log('Label not found in Gmail');
      return res.status(404).json({
        message : "Not Found",
        error : 'Label not found in Gmail'
      });
    
    }

    const labelId = label.labelId;
    const filterId = label.filterId;

    if (!labelId || !filterId){
      throw new Error("Neither labelId nor filterId can be empty")
    }

    await deleteGmailLabel(req.gmail, labelId, filterId);

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
