import dotenv from 'dotenv';
dotenv.config();

export const validateEnv = () => {
  const requiredEnvVars = [
    'PORT',
    'MONGODB_CONNECTION_URI',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GMAIL_REDIRECT_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Missing environment variable ${envVar}`);
    }
  }
};

export const env = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_CONNECTION_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GMAIL_REDIRECT_URL: process.env.GMAIL_REDIRECT_URL
};
