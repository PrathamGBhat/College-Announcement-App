// Creating the filter configuration in user's account
export async function createGmailLabel(gmail, labelName, fromList){
  
  // Creating the label and getting the label ID
  let createdLabel = await gmail.users.labels.create(
    {
      userId : 'me',
      requestBody : {
        name : labelName,
      }
    }
  );

  let labelId = createdLabel.data.id;

  // Making the query string in the format "from:abc@gmail.com OR from:def@gmail.com" to allow multiple email filtering
  let query="";
  for (let email of fromList){
    query+=email+" OR "
  }
  query=query.slice(0,query.length-4);

  // Creating the filter and getting the created filter
  let createdFilter = await gmail.users.settings.filters.create({ // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters
    userId:'me',
    requestBody:{
      criteria:{
        from:`(${query})`
      },
      action: {
        addLabelIds: [labelId]
      }      
    }
  });

  // Getting the ids of messages to which already fall in this filter
  const response = await gmail.users.messages.list({
    userId : 'me',
    q:'from:'+`(${query})`,
    maxResults : 300
  });
  const msgIdsList = (response.data.messages)?.map(msg => msg.id) || [];

  // Populating the label with all the emails that already satisfy filter
  if (msgIdsList.length){
    await gmail.users.messages.batchModify({
      userId : 'me',
      requestBody : {
        ids : msgIdsList,
        addLabelIds : [labelId]
      }
    })
  } 

  // Returning the filterId and labelId
  return {
    labelId : labelId,
    filterId : createdFilter.data.id
  };

}

// Retrieves mails using label id's passed as parameters
export async function retrieveMails(gmail, labelId){

  // Getting the list of message IDs
  const response = await gmail.users.messages.list({userId: 'me',labelIds : [labelId], maxResults:300}); // Holds the response from google api request
  const msgIdsList = response.data.messages || []; // any api response from google is wrapped in a .data // Only holds the id and thread id of messages, not the body 

  // Making an array which holds array of [subject, links] as entry then making an object subject link to map subject to link
  const entries = await Promise.all(msgIdsList.map(async (msgIds) => {

    // Obtaining the message headers
    const msgObj = await gmail.users.messages.get({userId: 'me', id: msgIds.id})
    const headers = msgObj.data.payload.headers;  // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages#Message 
                                                  // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages#Message.MessagePart


    // Creating the object having subjects mapped to links
    let link, subject, email;

    for (let header of headers){
      if (header.name=='Subject'){
        subject = `${header.value}`;
      }
      if (header.name=='Delivered-To'){
        email=`${header.value}`;
      }
    }

    link=`https://mail.google.com/mail/?email=${email}#inbox/${msgIds.id}`;
    return [subject, link];

  }));

  const subject_links = Object.fromEntries(entries);

  // Returning the object
  return subject_links;

}

// Deleting the filter if it is present in the user's account
export async function deleteGmailLabel(gmail, labelId, filterId){

  // Deleting the filter
  await gmail.users.settings.filters.delete({ // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters
    userId:'me',
    id: filterId
  });

  // Deleting the label using label ID
  await gmail.users.labels.delete({
    userId : 'me',
    id : labelId
  });
  
}

