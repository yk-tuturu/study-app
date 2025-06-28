import subjectModel from "../models/subjectModel.js";

const newSubject = async (req, res) => {
    const dupe = await subjectModel.findOne({name: req.body.name, userId: req.userID})

    if (dupe) {
        return res.status(500).json({success: false, message: "The subject already exists!"})
    }

    const subject = new subjectModel({
        name: req.body.name, 
        userId: req.userID,
        color: req.body.color
    })

    try {
        await subject.save(); 
        res.status(200).json({success:true, message: "New Subject Created"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error creating subject"})
    }
}

const deleteSubject = async (req, res) => {
    const { userId, subjectName } = req.body;

    try {
        const deletedSubject = await subjectModel.findOneAndDelete({ userId, subjectName });

        if (!deletedSubject) {
            return res.status(404).json({ success: false, message: "Subject not found or does not belong to user" });
        }

        res.json({ success: true, message: "Subject deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting subject" });
    }
};

const updateMins = async (req, res) => {
    const { subjectId, mins } = req.body;
    const { userID } = req;

    if (!userID || !mins || !subjectId) {
        return res.status(400).json({ success: false, message: "Invalid input: userId, study duration and subject id are required." });
    }

    if (typeof mins !== 'number' || mins <= 0) {
        return res.status(400).json({ success: false, message: "Invalid input: study duration must be a positive number." });
    }

    try {
        const updatedSubject = await subjectModel.findOneAndUpdate(
            { userId: userID, _id: subjectId },
            { $inc: { totalMins: mins } },
            { new: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({ success: false, message: "Subject not found for the given user." });
        }

        return res.json({ success: true, message: "Study hours updated successfully.", data: updatedSubject });
    } catch (error) {
        console.error("Error updating hours:", error);
        return res.status(500).json({ success: false, message: "An error occurred while updating study hours." });
    }
};

const getAllSubjects = async(req, res) => {
    const { userID } = req;

    if (!userID) {
        return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    try {
        const subjects = await subjectModel.find({userId: userID});

        return res.status(200).json({
            success: true,
            data: subjects,
        });

    } catch (error) {
        console.error("Error fetching subject info:", error);
        return res.status(500).json({success: false, message: "An error occurred while fetching subject info."});
    }
}

const getSubjectDetails = async(req, res) => {
    const { userID } = req;
    const { id } = req.query;

    if (!userID || !subjectId) {
        return res.status(400).json({ success: false, message: "Invalid user id or subject id" });
    }

    try {
        const subject = await subjectModel.findOne({userId: userID, _id: subjectId});

        return res.status(200).json({
            success: true,
            data: subject,
        });

    } catch (error) {
        console.error("Error fetching subject info:", error);
        return res.status(500).json({success: false, message: "An error occurred while fetching subject info."});
    }
}

export {newSubject, deleteSubject, updateMins, getAllSubjects, getSubjectDetails}; 