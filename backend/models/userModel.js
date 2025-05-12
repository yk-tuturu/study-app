import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type:String,required:true}, 
    email: {type:String,required:true,unique:true}, 
    password: {type:String,required:true,unique:true}, 
    coins: {type:Number, default:0}, 
    pet: {
        wearing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'item'}]
      }
}, {minimize:false}) 

const userModel = mongoose.models.user || mongoose.model("user", userSchema); 
export default userModel; 