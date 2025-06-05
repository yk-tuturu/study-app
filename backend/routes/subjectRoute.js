import express from "express"
import { deleteSubject, getAllSubjects, newSubject, updateMins, getSubjectDetails } from "../controllers/subjectController.js";
import authMiddleware from "../middleware/auth.js";

const subjectRouter = express.Router()

subjectRouter.post('/new', authMiddleware, newSubject)
subjectRouter.post('/delete', authMiddleware, deleteSubject)
subjectRouter.post('/update', authMiddleware, updateMins)
subjectRouter.get("/getAll", authMiddleware, getAllSubjects)
subjectRouter.get("/get", authMiddleware, getSubjectDetails)

export default subjectRouter; 