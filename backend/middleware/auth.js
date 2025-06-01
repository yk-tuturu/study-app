import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
        return res.json({success:false, message:"Not Authorised. Please login to your account"})
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