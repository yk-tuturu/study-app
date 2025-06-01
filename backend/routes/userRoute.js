import express from "express"
import {getAccessories, addCoins, changePassword, getUserInfo, loginUser, registerUser} from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/changePassword", changePassword)
userRouter.get("/getInfo", authMiddleware, getUserInfo)
userRouter.post("/addCoins", authMiddleware, addCoins)
userRouter.get("/accessories", authMiddleware, getAccessories)

export default userRouter; 