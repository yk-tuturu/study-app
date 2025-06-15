import express from "express"
import { addItem, buyItem, listAllItems, listItemsByType, wearItem } from "../controllers/itemController.js";

const itemRouter = express.Router()

itemRouter.post('/add', addItem)
itemRouter.get('/list', listItemsByType)
itemRouter.get('/listAll', listAllItems)
itemRouter.post('/buy', buyItem)
itemRouter.post('/wear', wearItem)

export default itemRouter; 