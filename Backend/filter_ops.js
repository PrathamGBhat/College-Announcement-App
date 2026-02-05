// Currently simulating filterObject as parameter in function - remove once database comes

// Creating the filter configuration in user's account

export async function createGmailFilter(gmail, filterName, fromList){
  
  // Creating the label and getting the label ID

  let createdLabel = await gmail.users.labels.create(
    {
      userId : 'me',
      requestBody : {
        name : filterName,
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

  return createdFilter.data; // Returns created filter

}

// Deleting the filter if it is present in the user's account

export async function deleteGmailFilter(gmail, filterName, filterId){

  // Deleting the filter

  await gmail.users.settings.filters.delete({ // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters
    userId:'me',
    id: filterId
  });

  // Deleting the label using label ID obtained by searching with filterName AKA labelName

  let labelId;

  let labelsResponse = await gmail.users.labels.list({
    userId : 'me'
  })
  let labels = labelsResponse.data.labels;

  for (let label of labels){
    if (label.name == filterName){
      labelId = label.id
    }
  }

  await gmail.users.labels.delete({
    userId : 'me',
    id : labelId
  });
  
}