// Currently simulating filterObject as parameter in function - remove once database comes

// Creating the filter configuration in user's account

export async function createGmailFilter(gmail, fromList){

  // Getting label ID for "RVCE"

  const labels = await gmail.users.labels.list({ userId: 'me' });
  let rvceLabelId;

  for (let label of labels.data.labels){
    if (label.name == "RVCE"){
      rvceLabelId=label.id;
    }
  }
  
  if (!rvceLabelId) {
    throw new Error('RVCE label not found');
  }

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
        addLabelIds: [rvceLabelId]
      }      
    }
  });

  return createdFilter.data;

}

// Deleting the filter if it is present in the user's account

export async function deleteGmailFilter(filterObject, gmail, filterName){

  try{

    // Obtaining the filter ID from the filterObject using filterName

    let filterId = filterObject[filterName]

    // Deleting the filter from the user's account

    let deletedFilter = await gmail.users.settings.filters.delete({ // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters
      userId:'me',
      id: filterId
    });

    if (deletedFilter == {}) delete filterObject[filterName];
    
    return "Filter Deletion Successful";

  } catch (err) {

    return err;
    
  }

}