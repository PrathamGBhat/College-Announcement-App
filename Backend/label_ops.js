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
    maxResults : 500
  });
  const msgIdsList = response.data.messages.map(msg => msg.id);

  // Populating the label with all the emails that already satisfy filter
  
  await gmail.users.messages.batchModify({
    userId : 'me',
    requestBody : {
      ids : msgIdsList,
      addLabelIds : [labelId]
    }
  })

  return {
    labelId : labelId,
    filterId : createdFilter.data.id
  };

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