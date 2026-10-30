import jwt from "jsonwebtoken";
import { userModel } from "../DB/Models/user.model.js";

export const authentication = async (req,res,next) => {
    try {
        const {x} = req.headers;
        const {id} = jwt.verify(x,process.env.TOKEN_KEY);
        const user = await userModel.findById(id);
        if(!user){
            return res.json({message:"user not found"});
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.json({message:"failed to get user"});
    }
}