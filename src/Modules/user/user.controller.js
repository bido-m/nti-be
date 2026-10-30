import CryptoJS from "crypto-js";
import { userModel } from "../../DB/Models/user.model.js";
import v2 from "../../services/media.config.js";

const getProfile = async (req,res,next) => {
    try {
        const { user } = req;
        user.phone = CryptoJS.AES.decrypt(user.phone,process.env.PHONE_KEY).toString(
            CryptoJS.enc.Utf8
        );
        return res.json({user});
    } catch (error) {
        res.json({message:"Failed to get user profile",error:error.message});
    }
}

const upload = async (req,res,next) => {
    try {
        const {_id} = req.user;
        const user = await userModel.findById(_id);
        if(!user){
            return next(new Error("user delete the account"));
        }
        if(user.profile.public_id) {
            await v2.uploader.destroy(user.profile.public_id);
        }
        const {secure_url,public_id} = await v2.uploader.upload(req.file.path,{
            folder:"e-comm/profiles"
        })
        user.profile={secure_url,public_id};
        await user.save();
        return res.json({message:"profile updated successfully",user});
    } catch (error) {
        return next(error);
    }
}

const update = async (req,res,next) => {
    try {
        const {_id} = req.user;
        const {name,email,address,phone,gender} = req.body;
        const user = await userModel.findById(_id);
        if(!user){
            return next(new Error("user delete the account"));
        }
        user.name = name;
        user.email = email;
        let formattedAddress = [];
        if (address) {
            formattedAddress = Array.isArray(address) ? address : [address];
        }
        user.address = formattedAddress;
        user.phone = CryptoJS.AES.encrypt(phone,process.env.PHONE_KEY).toString();
        user.gender = gender;
        await user.save();
        return res.json({message:"data updated successfully",user});
    } catch (error) {
        return next(error);
    }
}

export{
    getProfile,
    upload,
    update
}