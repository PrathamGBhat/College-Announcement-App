export default async function retrieveMails(gmail, labelId){

  // Getting the list of message IDs

  const response = await gmail.users.messages.list({userId: 'me',labelIds : [labelId], maxResults:300}); // Holds the response from google api request
  const msgIdsList = response.data.messages; // any api response from google is wrapped in a .data // Only holds the id and thread id of messages, not the body 

  const subject_links={}; // Object that holds subjects mapped to their links

  for (let msgIds of msgIdsList){

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
    subject_links[subject]=link;

  }

  // Returning the object

  return subject_links;

}