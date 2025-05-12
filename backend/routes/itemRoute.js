import express from "express"
import { addItem } from "../controllers/itemController";

const itemRouter = express.Router()

itemRouter.post('/add', addItem)

export default itemRouter; 