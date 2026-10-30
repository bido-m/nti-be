import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:[2,"Name must be at least 2 characters"],
        maxlength:[30,"Name must be at most 30 characters"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,"email is invalid format"],
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"Password must be at least 6 characters"]
    },
    address:[{
        street:{type:String},
        city:{type:String},
        postalCode:{type:String}
    }],
    phone:{
        type:String,
    },
    gender:{
        type:String,
        enum:["male", "female","not specified"],
        default: "not specified"
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    profile:{
        secure_url:{
            type:String
        },
        public_id:{
            type:String
        }
    },
    wishlist:[{ 
        type: Schema.Types.ObjectId, 
        ref: "product" 
    }]
},{
    timestamps:true
});

export const userModel = mongoose.model("user",userSchema);