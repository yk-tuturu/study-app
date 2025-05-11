import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema({
    name: {type:String,required:true}, 
    totalhours: {type:Number,default:0}, 
}, {minimize:false}) 

const subjectModel = mongoose.models.subject || mongoose.model("subject", subjectSchema); 
export default subjectModel; 