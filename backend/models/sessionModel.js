import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    date: {type:datetime,required:true},
    subjectID: {type:String,required:true},
    duration: {type: Number, required:true},
})

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema); 
export default sessionModel;