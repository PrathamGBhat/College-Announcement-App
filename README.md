# Gmail Reader

(Outdated README.md)
A backend web application that reads the subjects of mails received by authenticated user and returns a json containing keys as the subject and links to the mails as values

## Project Structure

```
├── Backend/
│   ├── .env                    # Environment variables (not tracked in git)
│   ├── main.js                 # Main backend application
│   ├── mail_retriever.js       # Retrieves mails based on filter
│   └── filter_ops.js           # All filter related functions
│   
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Features

- Google OAuth 2.0 authentication
- REST API endpoint for subject-link mapped json response

## Prerequisites

- Node.js installed
- Setup ngrok - for exposing your localhost as url to entire internet which OAuth will use

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `Backend/` directory:
   ```
   PORT = 3000

   GOOGLE_CLIENT_ID = 165322321235-41ek2dk8pv3sq9k3i80h9edqms4gkkma.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = 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
   GMAIL_REDIRECT_URL = https://nonflexible-graeme-bionomical.ngrok-free.dev/callback
   ```

3. **Set up ngrok (for local development):**
   ```bash
   ngrok http 3000
   ```
   Copy the generated HTTPS URL and use it as your `GMAIL_REDIRECT_URL` in the `.env` file.

## Running the Application

1. Start the backend server:
   ```bash
   node Backend/gmail_reader.js
   ```

2. Copy the authorization URL from the console output

3. Open the URL in your browser and grant permissions

4. After authentication, you'll be redirected to `/callback` which will return a JSON object with email subjects mapped to their Gmail links

## API Endpoint

### GET `/callback`
Handles OAuth callback and fetches Gmail messages.

**Response:**
```json
{
  "Email Subject 1": "https://mail.google.com/mail/?email=user@gmail.com#inbox/message_id_1",
  "Email Subject 2": "https://mail.google.com/mail/?email=user@gmail.com#inbox/message_id_2"
}
```

## How It Works

# Not updated version 

1. **OAuth2Client** acts as the authentication manager between the user and Google APIs
2. **Gmail Client** performs Gmail operations once OAuth2Client has valid tokens
3. User authenticates via Google's OAuth consent screen
4. Backend exchanges authorization code for access tokens
5. Backend fetches messages using Gmail API
6. Email subjects and links are extracted and returned as JSON

## Security Notes

- Never commit `.env` files (already in `.gitignore`)
- Keep OAuth credentials secure
- Use HTTPS for production redirect URLs
- The ngrok URL changes on each restart during development

## Technologies Used

- **Backend:** Node.js, Express.js
- **Authentication:** Google OAuth 2.0
- **API:** Gmail API (googleapis npm package)
- **Environment Management:** dotenv

## Future Enhancements

- Connect frontend to display emails in styled cards
- Add pagination for more than 10 emails
- Implement email search/filter functionality
- Add email body preview
- Store and refresh tokens for persistent authentication

## License

This project is for educational purposes.
