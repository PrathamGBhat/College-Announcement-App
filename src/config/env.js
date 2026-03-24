import dotenv from 'dotenv';
dotenv.config();

export const validateEnv = () => {

  const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'SESSION_SECRET',
    'MONGODB_CONNECTION_URI',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Missing environment variable ${envVar}`);
    }
  }
  
};

export const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV : process.env.NODE_ENV,
  SESSION_SECRET : process.env.SESSION_SECRET,
  MONGODB_URI: process.env.MONGODB_CONNECTION_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
};
