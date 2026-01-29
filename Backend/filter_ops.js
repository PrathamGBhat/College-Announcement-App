// Currently simulating filterObject as parameter in function - remove once database comes

// Creating the filter configuration in user's account

export async function createGmailFilter(filterObject, gmail, filterName,...fromList){

  try{

    // Making the query string in the format "from:abc@gmail.com OR from:def@gmail.com" to allow multiple email filtering

    let query="";
    for (let email of fromList){
      query+="from:"+email+" OR "
    }
    query=query.slice(0,query.length-4);

    // Creating the filter and getting the created filter

    let createdFilter = await gmail.users.settings.filters.create({ // https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters
      userId:'me',
      requestBody:{
        criteria:{
          query:query
        }
      }
    });

    filterObject[filterName]=createdFilter.data.id; // Replace with dropping to db

    return "Filter Creation Successful";

  } catch (err) {
    return err.message;
  }

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

    if (deletedFilter == {}) delete filterObject[filterName]; // Replace with removing from DB
    
    return "Filter Deletion Successful";

  } catch (err) {
    return err.message;
  }

}