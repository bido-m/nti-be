import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    logo:{
        secure_url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        }
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{
    timestamps:true
});

export const brandModel = mongoose.model("brand",brandSchema);