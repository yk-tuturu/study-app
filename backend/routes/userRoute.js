import express from "express"
import {getAccessories, addCoins, changePassword, getUserInfo, loginUser, registerUser} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/changePassword", changePassword)
userRouter.get("/getInfo", getUserInfo)
userRouter.post("/addCoins", addCoins)
userRouter.get("/accessories", getAccessories)

export default userRouter; 