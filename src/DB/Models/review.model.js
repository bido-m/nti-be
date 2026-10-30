import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true,
        trim:true
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    product_id:{
        type:Schema.Types.ObjectId,
        ref:"product",
        required:true
    }
},{
    timestamps:true
});

export const reviewModel = mongoose.model("review",reviewSchema);