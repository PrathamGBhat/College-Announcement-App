# Gmail Reader

A comprehensive Node.js web application that enables users to create custom Gmail labels and filters, then retrieve emails from those labels through a clean REST API and interactive web interface.

## Overview

Gmail Reader streamlines email organization by allowing you to:
- **Authenticate** securely using Google OAuth 2.0
- **Create custom labels** in Gmail with automatic email filters based on sender addresses
- **Retrieve emails** from custom labels with subject-to-link mappings
- **Manage labels** (create, list, delete) through an intuitive UI or REST API

Unlike Gmail's basic filtering, this application lets you define multiple "from" addresses for a single label, automatically applying the filters to existing emails and maintaining them going forward.

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** Google OAuth 2.0
- **APIs:** Google Gmail API v1
- **Frontend:** HTML/CSS/JavaScript
- **Development:** Nodemon for automatic reload
- **Environment:** dotenv for configuration

## Project Structure

```
Gmail Reader/
├── public/
│   └── index.html              # Frontend UI for managing labels - VIBE CODED ;p
│
├── src/
│   ├── server.js               # Main Express application
│   ├── temp.js                 # Temporary utility file
│   ├── config/
│   │   ├── env.js              # Environment variables validation
│   │   ├── database.js         # MongoDB connection setup
│   │   └── oauth.js            # Google OAuth 2.0 configuration
│   ├── controllers/
│   │   ├── authController.js   # OAuth callback handling
│   │   ├── emailController.js  # Email retrieval logic
│   │   └── labelController.js  # Label CRUD operations
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── emailRoutes.js      # Email retrieval endpoints
│   │   └── labelRoutes.js      # Label management endpoints
│   ├── services/
│   │   ├── emails.js           # Email fetching from Gmail API
│   │   └── labels.js           # Gmail label and filter creation/deletion
│   └── model/
│       └── Label.js            # Label database schema
│
├── package.json                # Project dependencies
└── README.md                   # Documentation
```

## Features

### ✨ Core Features
- **Google OAuth 2.0 Authentication** - Secure login without storing passwords
- **Custom Label Creation** - Create Gmail labels with multi-email filters in one action
- **Automatic Email Filtering** - Filters automatically apply to existing and future emails
- **Email Retrieval** - Fetch emails from custom labels as subject-link mappings (up to 300 emails)
- **Label Management** - View, create, and delete labels with corresponding Gmail cleanup
- **Persistent Storage** - Labels stored in MongoDB for user session management
- **RESTful API** - Complete API for programmatic access

### 🔧 Technical Advantages
- Modular architecture with separation of concerns
- Comprehensive error handling and validation
- Environment-based configuration
- Direct Gmail API integration (no third-party mail services)
- Batch operations for efficient Gmail updates
- Automatic redirection links to original Gmail messages

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database
- **Google Cloud Project** - For OAuth credentials
- **ngrok** (optional, for local development) - [Download](https://ngrok.com/)

## Setup Guide

### 1. Clone or Download the Repository
```bash
cd "path/to/Gmail Reader"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Gmail API**:
   - Search for "Gmail API" in the search bar
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" in the sidebar
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For local development: `http://localhost:3000/callback`
     - For production: `https://yourdomain.com/callback`
   - Copy your **Client ID** and **Client Secret**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_CONNECTION_URI=mongodb://localhost:27017/gmail-reader
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_cloud
GMAIL_REDIRECT_URL=http://localhost:3000/callback (https://nonflexible-graeme-bionomical.ngrok-free.dev/callback as google doesn't allow localhost)
```

**Environment Details:**
- `PORT` - Server port (default: 3000)
- `MONGODB_CONNECTION_URI` - MongoDB connection string (local or Atlas)
- `GOOGLE_CLIENT_ID` - OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET` - OAuth 2.0 Client Secret
- `GMAIL_REDIRECT_URL` - Callback URL after Google login

### 5. Set Up Local Database

**Option A: Local MongoDB**
```bash
mongod  # Start MongoDB service
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Use the connection string in `MONGODB_CONNECTION_URI`

### 6. Run the Application

```bash
npm start
```

The server will start on `http://localhost:3000` and output:
```
Server listening on http://localhost:3000
Auth URL: https://accounts.google.com/o/oauth2/v2/auth?...
```

### 7. Access the Application

1. Open browser to `http://localhost:3000`
2. Click login button to authenticate with Google
3. Authorize the application to access Gmail
4. You'll be redirected to the main dashboard

### 8. (Optional) For Remote Access - Set Up ngrok

For testing OAuth redirect URLs outside localhost:
```bash
ngrok http 3000
```

Then update `GMAIL_REDIRECT_URL` in `.env` to the ngrok URL.

## API Endpoints

### Authentication
- **`GET /callback`** - OAuth 2.0 callback endpoint
  - Query: `code` (from Google)
  - Exchanges authorization code for tokens

### Labels
- **`GET /api/labels`** - Get all user's custom labels
  - Response: Array of label names
  ```json
  {
    "message": "OK",
    "data": ["Work", "Projects", "Vendors"]
  }
  ```

- **`POST /api/create-label`** - Create new label with filters
  - Body: `{ "labelName": "string", "fromList": ["email@example.com"] }`
  - Response: Success/error message
  ```json
  {
    "message": "Created",
    "data": "Successfully created label Work"
  }
  ```

- **`DELETE /api/delete-label/:labelName`** - Delete label and filters
  - Parameters: `labelName`
  - Response: Success/error message

### Emails
- **`GET /api/emails/:labelName`** - Get emails from a label
  - Parameters: `labelName`
  - Response: Object mapping subjects to Gmail web links
  ```json
  {
    "message": "OK",
    "data": {
      "Project Update": "https://mail.google.com/mail/?email=user@gmail.com#inbox/MESSAGE_ID",
      "Meeting Notes": "https://mail.google.com/mail/?email=user@gmail.com#inbox/MESSAGE_ID"
    }
  }
  ```

## Usage Example

### Create a Label
```bash
curl -X POST http://localhost:3000/api/create-label \
  -H "Content-Type: application/json" \
  -d '{
    "labelName": "Vendors",
    "fromList": ["vendor1@company.com", "vendor2@company.com"]
  }'
```

### Get All Labels
```bash
curl http://localhost:3000/api/labels
```

### Get Emails from Label
```bash
curl http://localhost:3000/api/emails/Vendors
```

### Delete a Label
```bash
curl -X DELETE http://localhost:3000/api/delete-label/Vendors
```

## How It Works

1. **Authentication Flow**
   - User clicks login button
   - Redirects to Google OAuth consent screen
   - User grants Gmail access permissions
   - Google redirects to `/callback` with authorization code
   - Server exchanges code for access tokens
   - Tokens stored in OAuth2Client for Gmail API calls

2. **Label Creation Flow**
   - User submits label name and list of sender emails
   - System creates Gmail label
   - System creates Gmail filter: `from:(email1@example.com OR email2@example.com) → addLabelIds:[labelId]`
   - System applies label to matching existing emails
   - Label metadata stored in MongoDB

3. **Email Retrieval Flow**
   - User requests emails from a label
   - System queries Gmail for messages with that label ID (max 300)
   - For each message, fetches headers to extract subject and "Delivered-To"
   - Constructs direct Gmail links: `https://mail.google.com/mail/?email={email}#inbox/{messageId}`
   - Returns subject-to-link object as JSON

4. **Label Deletion Flow**
   - User deletes a label
   - System deletes Gmail filter
   - System deletes Gmail label
   - System removes record from MongoDB

## Permissions Required

The application requests the following Gmail scopes:
- `https://www.googleapis.com/auth/gmail.settings.basic` - Read Gmail settings
- `https://www.googleapis.com/auth/gmail.modify` - Modify Gmail labels and filters

These permissions allow the app to:
- Create and delete labels
- Create and delete filters
- Modify message labels
- Read message headers

## Limitations

- Retrieves maximum 300 emails per label (Gmail API limitation)
- Requires active Google authentication session
- Labels are user-specific (one user per deployment)
- Filters based on "from" addresses only

## Error Handling

The API returns standard HTTP status codes:
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Missing or invalid parameters
- `404 Not Found` - Label not found in database
- `500 Internal Server Error` - Server-side error

Example error response:
```json
{
  "message": "Bad Request",
  "error": "Both labelName and fromList required in request body"
}
```

## Development

### Start Development Server
```bash
npm start
```
Uses Nodemon to automatically reload on file changes.

### Project Scripts
- `npm start` - Start development server with Nodemon

## Troubleshooting

### "Missing environment variable" warning
- Ensure all required variables in `.env` are set
- Check file is in root directory

### OAuth redirect fails
- Verify redirect URL matches Google Cloud Console OAuth settings
- Ensure ngrok URL (if used) is in authorized redirect URIs

### MongoDB connection error
- Verify MongoDB is running (`mongod` for local)
- Check connection string in `.env`
- Ensure network access (if using Atlas)

### Emails not retrieved
- Verify label exists in Gmail account
- Check label name matches exactly (case-sensitive)
- Ensure emails match the filter criteria

## Related Resources

- [Google Gmail API Documentation](https://developers.google.com/gmail/api/guides)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## License

ISC

## Repository

[GitHub - Gmail Reader Private](https://github.com/PrathamGBhat/Gmail-Reader-Private)
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
