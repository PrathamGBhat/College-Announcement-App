import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {

  try {

    await mongoose.connect(env.MONGODB_URI);
    console.log("Database connected successfully");

  } catch (err) {

    console.error("Database connection error: " + err.message);
    process.exit(1);
    
  }
};


