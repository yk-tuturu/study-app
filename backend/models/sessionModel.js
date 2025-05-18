import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    name: {type:String,required:true},
    type: {type: String, required:true}, // hats, headbands
    price: {type:Number,required:true},
    image: {type: String, required:true},
    description: {type: String, required: true}
})

const itemModel = mongoose.models.item || mongoose.model("item", itemSchema); 
export default itemModel;