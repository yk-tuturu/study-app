import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// create token 
const createToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET)
}

// Login function 
const loginUser = async (req, res) => {
    const {email,password} = req.body; 
    try {
        const user = await userModel.findOne({email}); 

        if (!user) {
            return res.json({success:false, message:"User doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password); 

        if (!isMatch) {
            return res.json({success:false, message:"Invalid credentials"})
        }

        const token = createToken(user._id); 
        res.json({success:true, token})
    } catch (error) {
        console.log(error); 
        res.json({success: false, message: error})
    }
}

// register user
const registerUser = async (req, res) => {
    const {name, email, password, confirmPassword} = req.body; 

    try {
        // validate email and password 
        if (!validator.isEmail(email)) {
            return res.status(500).json({success:false, message:"Please enter a valid email"})
        }

        if (confirmPassword !== password) {
            return res.status(500).json({success:false, message:"Please ensure both passwords are the same"})
        }

        if (password.length < 8 ) {
            return res.status(500).json({success:false, message:"Password length should be greater than 8"})
        }

        // check if account already exists
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.status(500).json({success:false, message:"Account already exists"})
        }

        // hash user password 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        // save user to database 
        const newUser = new userModel({
            name: name, 
            email: email, 
            password: hashedPassword, 
        })

        const user = await newUser.save()

        // create token 
        const token = createToken(user._id)
        res.status(200).json({success:true, token})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Error"})
    }
}

// Change password function
const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword, confirmPassword} = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Validate current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }

        if (confirmPassword != newPassword) {
            return res.json({success:false, message:"Please ensure both passwords are the same"})
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password length should be greater than 8" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating password" });
    }
};

// get user's information (name, email, coins)
const getUserInfo = async (req, res) => {
    const { userID } = req; 

    if (!userID) {
        return res.status(400).json({success: false, message: "Invalid input: userId is required."});
    }

    try {
        const user = await userModel.findById(userID).select("name email coins");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({success: false, message: "An error occurred while fetching user info."});
    }
};

// get accessories currently worn by pet 
const getAccessories = async (req, res) => {
    const { userId } = req.userID;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Invalid input: userID is required." });
    }

    try {
        const user = await userModel.findById(userId)
            .populate('pet.wearing.head')
            .populate('pet.wearing.body')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const accessories = {
            head: user.pet?.wearing?.head || null,
            body: user.pet?.wearing?.body || null,
        };

        return res.status(200).json({
            success: true,
            data: accessories,
        });

    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({ success: false, message: "An error occurred while fetching user info." });
    }
};

// get accessories user owns
const getOwnedAccessories = async (req, res) => {
    const { userID } = req;

    if (!userID) {
        return res.status(400).json({ success: false, message: "Invalid input: userID is required." });
    }

    try {
        const user = await userModel.findById(userID).populate("owned_items")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const accessories = user.owned_items; 

        return res.status(200).json({
            success: true,
            data: accessories,
        });

    } catch (error) {
        console.error("Error fetching user's owned accessories:", error);
        return res.status(500).json({ success: false, message: "An error occurred while fetching user's owned accessories." });
    }
};

// add coins after finishing a study session
const addCoins = async (req, res) => {
    const { coinAmount } = req.body; 
    const { userID } = req;

    if (!userID) {
        return res.status(400).json({success: false, message: "Invalid input: userID is required."});
    }

    if (typeof coinAmount !== 'number' || coinAmount < 0) {
        return res.status(400).json({ success: false, message: "Invalid input: coin amount must be a positive number." });
    }

    try {
        const user = await userModel.findById(userID)

        if (!user) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        user.coins += coinAmount;
        await user.save();

        return res.status(200).json({success: true, message: "Coins added successfully."});

    } catch (error) {
        console.error("Error adding coins", error);
        return res.status(500).json({success: false, message: "An error occurred while adding coins."});
    }
};

export {loginUser, registerUser, changePassword, getUserInfo, addCoins, getAccessories, getOwnedAccessories}; 