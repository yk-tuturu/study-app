import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req, res, next) => {    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
        return res.status(400).json({success:false, message:"Not Authorised. Please login to your account"})
    }

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization token missing or malformed' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET); 
        req.userID = token_decode.id; 
        next(); 
    }
    catch (error) {
        console.log(error)
        res.json({success:false, message:"error"})
    }
}

export default authMiddleware; 