import mongoose from "mongoose"; 

// connect to mongoDB database 
export const connectDB = async () => {
    await mongoose.connect('INSERT STRING HERE').then(()=> console.log("DB connected"))
}