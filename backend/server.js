import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import 'dotenv/config'

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
app.use("/api/item", itemRouter)

// run express server 
app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})