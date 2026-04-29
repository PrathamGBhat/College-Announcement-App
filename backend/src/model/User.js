import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    googleId : String,
    email : String,
    name : String,
    accessToken : String,
    refreshToken : String
})

export const User = mongoose.model("User",UserSchema);