import express from "express"
import { addItem, buyItem, listAllItems, listItemsByType, wearItem } from "../controllers/itemController.js";
import authMiddleware from "../middleware/auth.js";

const itemRouter = express.Router()

itemRouter.post('add', addItem)
itemRouter.post('/listItemsByType', listItemsByType)
itemRouter.get('/listAll', listAllItems)
itemRouter.post('/buy', authMiddleware, buyItem)
itemRouter.post('/wear', authMiddleware, wearItem)

export default itemRouter; 