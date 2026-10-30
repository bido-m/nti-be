import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    products: [{
        product_id:{
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        name:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        },
    }],
    status:{
        type:String,
        enum:["pending","completed","canceled"],
        default:"pending"
    },
    total:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

export const orderModel = mongoose.model("order",orderSchema);