import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'subject', required: true }, 
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now } 
});

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema); 
export default sessionModel;