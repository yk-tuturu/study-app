import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type:String,required:true}, 
    email: {type:String,required:true}, 
    password: {type:String,required:true}, 
    coins: {type:Number, default:0}, 
    owned_items: [{type:mongoose.Schema.Types.ObjectId, ref:"item"}], 
    pet: {
        wearing:  {
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    neck: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    body: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    tail: { type: mongoose.Schema.Types.ObjectId, ref: 'item' }
  }
      }
}, {minimize:false}) 

const userModel = mongoose.models.user || mongoose.model("user", userSchema); 
export default userModel; 