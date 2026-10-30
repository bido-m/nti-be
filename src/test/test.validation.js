import Joi from "joi";

const user = {
    name:"mido",
    email:"sobhy@gmail.com",
    age:25,
    password:"123456",
    confirmPassword:"123456",
    isLive:true
};

const schema = Joi.object({
    name:Joi.string().required().min(2).max(30),
    email:Joi.string().email().required().lowercase(),
    age:Joi.number().min(20).max(50),
    password:Joi.string().min(6).required(),
    confirmPassword:Joi.string().valid(Joi.ref("password")).required(),
    isLive:Joi.boolean()
});

const result = schema.validate(user,{abortEarly:false});
console.log(result);
