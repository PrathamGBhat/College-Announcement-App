import mongoose from "mongoose";

const LabelSchema = new mongoose.Schema({
    labelName : {
        type : String,
        unique : true
    },
    labelId : String,
    filterId : String
});

export const Label = mongoose.model('Label', LabelSchema);