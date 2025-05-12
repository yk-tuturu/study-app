import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    date: {type:datetime,required:true},
    subjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'subject', required: true},
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    duration: {type: Number, required:true},
})

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema); 
export default sessionModel;