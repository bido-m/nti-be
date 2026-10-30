import mongoose, { Schema } from "mongoose";

const subcategorySchema = new Schema({
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
    category_id:{
        type:Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{
    timestamps:true
});

export const subcategoryModel = mongoose.model("subcategory",subcategorySchema);