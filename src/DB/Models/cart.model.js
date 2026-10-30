import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    },
    products: [{
        product_id:{
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity:{
            type: Number,
            default: 1,
            min: 1
        }
    }]
},{
    timestamps:true
})

export const cartModel = mongoose.model("cart",cartSchema);