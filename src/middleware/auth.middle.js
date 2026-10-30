import jwt from "jsonwebtoken";
import { userModel } from "../DB/Models/user.model.js";

export const authentication = async (req,res,next) => {
    try {
        const token = req.headers.x || req.headers.token || (req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s+/i, '') : null);
        if (!token) {
            return res.status(401).json({ message: "Authentication token required" });
        }
        const {id} = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await userModel.findById(id);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({message:"Authentication failed", error: error.message});
    }
}