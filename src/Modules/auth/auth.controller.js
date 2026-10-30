import { userModel } from "../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const register = async (req,res,next) => {
    try {
        const {name,email,password,confirmPassword,address,phone,gender} = req.body;
        const emailCheck = await userModel.findOne({email});
        if(emailCheck){
            return next(new Error("email is already exist",{cause:409}));
        }
        if(password!== confirmPassword){
            return next(new Error("Passwords do not match", { cause: 400 }));
        }
        const hashedPass = bcrypt.hashSync(password,+process.env.SALT_ROUNDS);
        let encryptedPhone;
        if (phone) {
            encryptedPhone = CryptoJS.AES.encrypt(phone, process.env.PHONE_KEY).toString();
        }
        let formattedAddress = [];
        if (address) {
            formattedAddress = Array.isArray(address) ? address : [address];
        }
        const user = await userModel.create({name,email,password:hashedPass,address,phone:encryptedPhone,address:formattedAddress,gender});
        return res.json({message:"user registered successfully",user:{
            id:user._id,
            name:user.name,
            email:user.email,
            address:user.address,
            phone,
            gender:user.gender,
            role:user.role
        }});
    } catch (error) {
        return next(error);
    }
};

const login = async (req,res,next) => {
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new Error("Invalid login credentials", { cause: 400 }));
        }
        const isPasswordMatch = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatch) {
            return next(new Error("Invalid login credentials", { cause: 400 }));
        }
        const token = jwt.sign({id:user._id,role:user.role,name:user.name},process.env.TOKEN_KEY,{expiresIn:"1d"});
        return res.status(200).json({message:"Logged in successfully",token});
    } catch (error) {
        return next(error);
    }
}


export{
    register,
    login,
}