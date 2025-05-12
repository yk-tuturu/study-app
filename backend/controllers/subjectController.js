import subjectModel from "../models/subjectModel.js";

const newSubject = async (req, res) => {
    
    const subject = new subjectModel({
        name: req.body.name, 
        userId: req.body.userId, 
    })
    
    try {
        await subject.save(); 
        res.json({success:true, message: "New Subject Created"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error creating subject"})
    }
}

const deleteSubject = async (req, res) => {
    const { userID, subjectName } = req.body;

    try {
        const deletedSubject = await subjectModel.findOneAndDelete({ userID, name });

        if (!deletedSubject) {
            return res.status(404).json({ success: false, message: "Subject not found or does not belong to user" });
        }

        res.json({ success: true, message: "Subject deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting subject" });
    }
};

const updateHours = async (req, res) => {
    const { userID, subjectName, hours } = req.body;

    if (!userID || !hours || !subjectName) {
        return res.status(400).json({ success: false, message: "Invalid input: userID, study duration and subject name are required." });
    }

    if (typeof hours !== 'number' || hours <= 0) {
        return res.status(400).json({ success: false, message: "Invalid input: study duration must be a positive number." });
    }

    try {
        const updatedSubject = await subjectModel.findOneAndUpdate(
            { userId: userID, name: subjectName },
            { $inc: { totalhours: hours } },
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

export {newSubject, deleteSubject, updateHours}; 