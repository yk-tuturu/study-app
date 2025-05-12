import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import subjectRouter from "./routes/subjectRoute.js"
import itemRouter from "./routes/itemRoute.js"

// app configuration 
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// Secure route
app.get("/", (req, res)=>{
    res.send("API Working")
})

// DB connection 
connectDB();

// API endpoints
app.use("/api/user", userRouter)
app.use("/api/subject", subjectRouter)
app.use("/api/item", itemRouter)


// run express server 
app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})