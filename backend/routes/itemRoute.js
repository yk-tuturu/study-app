import express from "express"
import { addItem, buyItem, equipItem, listAllItems, listItemsByType, takeOffItem, wearItem } from "../controllers/itemController.js";
import authMiddleware from "../middleware/auth.js";

const itemRouter = express.Router()

itemRouter.post('add', addItem)
itemRouter.post('/listItemsByType', listItemsByType)
itemRouter.get('/listAll', listAllItems)
itemRouter.post('/buy', authMiddleware, buyItem)
itemRouter.post('/wear', authMiddleware, wearItem)
itemRouter.post('/takeOff', authMiddleware, takeOffItem)
itemRouter.post('/equip', authMiddleware, equipItem)

export default itemRouter; 