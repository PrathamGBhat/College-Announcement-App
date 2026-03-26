# Gmail Reader

NodeJS app to segregate emails and display them in custom UI with Gmail API

## Overview

- **Authentication** : Google OAuth 2.0
- **Segregation and filtering** : Create gmail labels and filters through simpler app UI
- **Retrieve emails** : Tiles in UI linked to the actual mail

Integrates labels to handle segregate existing mails and filters to segregate newer incoming mails
Also handles categorization of multiple email ID's into labels without use of delicate expressions like from:abc@gmail.com OR from:def@gmail.com

## Tech Stack

- **Frontend:** HTML/CSS/JavaScript
- **Authentication:** Google OAuth 2.0 with Passport.js
- **Backend:** Node.js + Express.js
- **APIs:** Google Gmail API v1
- **Database:** MongoDB + Mongoose ODM

## Project Structure

```
Gmail Reader/
├── public/
│   └── index.html              # Frontend UI - VIBE CODED ;p
│
├── src/
│   ├── app.js                  # Main Express app
│   ├── config/
│   │   ├── env.js              # Environment variables validation
│   │   ├── database.js         # MongoDB connection setup
│   │   └── auth.js             # Passport.js configuration for OAuth 2.0
│   ├── controllers/
│   │   └── labelController.js  # Label create, list, retrieve, delete operations
│   ├── middleware/
│   │   └── authMiddleware.js   # Gmail client attachment middleware
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints (login, callback, profile, logout)
│   │   └── labelRoutes.js      # Label management & email retrieval endpoints
│   ├── services/
│   │   └── labels.js           # Helper functions to provide separate file for Gmail API interaction
│   └── model/
│       ├── Label.js            # Label database schema
│       └── User.js             # User database schema
│
├── package.json                # Project dependencies
└── README.md                   # Documentation
```

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database
- **Google Cloud Project** - For OAuth credentials

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
     - For local development: `http://localhost:3000/auth/google/callback`
     - For production: `https://yourdomain.com/auth/google/callback`
   - Copy your **Client ID** and **Client Secret**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_CONNECTION_URI=mongodb://localhost:27017/gmail-reader
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_cloud
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_session_secret_key
NODE_ENV=development
```

**Environment Details:**
- `PORT` - Server port (default: 3000)
- `MONGODB_CONNECTION_URI` - MongoDB connection string (local or Atlas)
- `GOOGLE_CLIENT_ID` - OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET` - OAuth 2.0 Client Secret
- `GOOGLE_CALLBACK_URL` - Callback URL after Google OAuth login
- `SESSION_SECRET` - Secret key for session management
- `NODE_ENV` - Environment mode (development/production)

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
```

### 7. Access the Application

1. Open browser to `http://localhost:3000`
2. Click Sign In button to authenticate with Google
3. Authorize the application to access Gmail
4. You'll be redirected to the main dashboard

## Features

### Core Features
- **Google OAuth 2.0 Authentication** - Secure login with session management
- **Session Management** - Express-session with secure HTTP-only cookies
- **Custom Label and Filter Management** - Create and delete Gmail labels and filters with multi-email filters to segregate both existing and future emails
- **Email Retrieval** - Fetch emails from custom labels as subject-link mappings (up to 300 emails)
- **RESTful API** - Complete API with proper authentication middleware
- **Persistent Storage** - User data and labels stored in MongoDB

## API Endpoints

### Authentication
- **`GET /auth/google/login`** - Initiate Google OAuth login
  - Redirects user to Google consent screen
  - Requests scopes: `profile`, `email`, `gmail.modify`, `gmail.settings.basic`

- **`GET /auth/google/callback`** - OAuth 2.0 callback endpoint
  - Query: `code` (from Google)
  - Exchanges authorization code for access/refresh tokens
  - Redirects to `/` on success, back to login on failure

- **`GET /auth/profile`** - Get authenticated user's profile
  - Requires: Active authentication session
  - Returns:
  ```json
  {
    "message": "OK",
    "data": {
      "name": "User Name",
      "email": "user@gmail.com"
    }
  }
  ```

- **`GET /auth/google/logout`** - Logout and destroy session
  - Clears session cookie and destroys session
  - Returns:
  ```json
  {
    "message": "Logout successful"
  }
  ```

### Labels
- **`GET /api/labels/list`** - Get all user's custom labels
  - Requires: Active authentication
  - Response: Array of label objects stored in database
  ```json
  {
    "message": "OK",
    "data": ["Work", "Projects", "Vendors"]
  }
  ```

- **`GET /api/labels/:labelName`** - Get emails from a label
  - Requires: Active authentication
  - Parameters: `labelName`
  - Response: Object mapping email subjects to Gmail web links
  ```json
  {
    "message": "OK",
    "data": {
      "Project Update": "https://mail.google.com/mail/u/0/?email=user@gmail.com#inbox/MESSAGE_ID",
      "Meeting Notes": "https://mail.google.com/mail/u/0/?email=user@gmail.com#inbox/MESSAGE_ID"
    }
  }
  ```

- **`POST /api/labels/create`** - Create new label with email filters
  - Requires: Active authentication
  - Body: 
  ```json
  {
    "labelName": "Work",
    "fromList": ["email1@example.com", "email2@example.com"]
  }
  ```
  - Response: Success/error message
  ```json
  {
    "message": "Created",
    "data": "Successfully created label Work"
  }
  ```

- **`DELETE /api/labels/delete/:labelName`** - Delete label and its filters
  - Requires: Active authentication
  - Parameters: `labelName`
  - Response: Success/error message
  ```json
  {
    "message": "Deleted",
    "data": "Label successfully deleted"
  }
  ```

## How It Works

Update with flowchart

## Development

### Start Development Server
```bash
npm start
```

### Login with Google
```bash
# Open browser and navigate to:
http://localhost:3000/auth/google/login
# This redirects to Google OAuth consent screen
```


### Get User Profile
```bash
curl http://localhost:3000/auth/profile
```

### Create a Label
```bash
curl -X POST http://localhost:3000/api/labels/create \
  -H "Content-Type: application/json" \
  -d '{
    "labelName": "Vendors",
    "fromList": ["vendor1@company.com", "vendor2@company.com"]
  }'
```

### Get All Labels
```bash
curl http://localhost:3000/api/labels/list
```

### Get Emails from Label
```bash
curl http://localhost:3000/api/labels/Vendors
```

### Delete a Label
```bash
curl -X DELETE http://localhost:3000/api/labels/delete/Vendors
```

### Logout
```bash
curl http://localhost:3000/auth/google/logout
```

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

## Troubleshooting

### "Missing environment variable" warning
- Ensure all required variables in `.env` are set
- Check file is in root directory

### OAuth redirect fails
- Verify redirect URL matches Google Cloud Console OAuth settings
- Ensure `GOOGLE_CALLBACK_URL` in `.env` matches your Google OAuth settings

### MongoDB connection error
- Verify MongoDB is running (`mongod` for local)
- Check connection string in `.env`
- Ensure network access (if using Atlas)

### Emails not retrieved
- Verify label and filter configuration exactly match that present in Gmail
- Else delete and create label again

## Limitations

- Handles maximum one user
- No active sync of gmail and app hence exact same config of labels and filters is a must
- Retrieves maximum 300 emails per label (Gmail API limitation)

## License

ISC

## Related Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Express.js Documentation](https://expressjs.com/)
- [Google Gmail API Documentation](https://developers.google.com/gmail/api/guides)
- [MongoDB Documentation](https://docs.mongodb.com/)