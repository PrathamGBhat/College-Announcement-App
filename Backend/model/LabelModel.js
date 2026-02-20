import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    labelName : {
        type : String,
        unique : true
    },
    labelId : String,
    filterId : String
});

export const UserModel = new mongoose.model('User',UserSchema);