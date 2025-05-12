import express from "express"
import { deleteSubject, newSubject, updateHours } from "../controllers/subjectController";

const subjectRouter = express.Router()

subjectRouter.post('/new', newSubject)
subjectRouter.post('/delete', deleteSubject)
subjectRouter.post('/update', updateHours)

export default subjectRouter; 