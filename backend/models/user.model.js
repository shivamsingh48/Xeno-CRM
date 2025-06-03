import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    
},{
    timestamps:true
}
)

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})


userSchema.methods.isPasswordCheck=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.isResetPasswordTokenCheck=async function(token){
    return await bcrypt.compare(token,this.resetPasswordToken)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            fullName:this.fullName,
            email:this.email,
            password:this.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema);