import mongoose from "mongoose"; 

// connect to mongoDB database 
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://limshujin2005:studyapp@cluster0.a2gtnr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=> console.log("DB connected"))
}

// connection string: mongodb+srv://limshujin2005:studyapp@cluster0.a2gtnr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0