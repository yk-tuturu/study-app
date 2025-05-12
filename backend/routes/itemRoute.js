import express from "express"
import { addItem, buyItem, listItemsByType, wearItem } from "../controllers/itemController";

const itemRouter = express.Router()

itemRouter.post('/add', addItem)
itemRouter.get('/list', listItemsByType)
itemRouter.post('/buy', buyItem)
itemRouter.post('/wear', wearItem)

export default itemRouter; 