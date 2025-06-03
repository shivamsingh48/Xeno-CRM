import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { oauth2client } from "../utils/googleConfig.js";
import axios from 'axios'
import crypto from 'crypto';

const registerUser=asyncHandler(async (req,res)=>{
    const {fullName,email,password}=req.body;

    if([fullName,email,password].some((field)=>field?.trim()==="")){
        return res.status(401).json({success:"false",message:"All fields are required!"})
    }

    const existedUser=await User.findOne({email})

    if(existedUser){
        return res.status(400).json({success:"false",message:"This email is already registered"})
    }

    const user=await User.create({
        fullName,
        email,
        password
    })

    if(!user){
        return res.status(401).json({success:"false",message:"Something went while registering user!"})
    }
    return res.status(201).json({
        success:"true",
        user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
        }
    })
})

const login=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;

    if(!email){
        return res.status(400).json({success:"false",message:"Email is required!"})
    }

    const user=await User.findOne({email});

    if(!user){
        return res.status(401).json({success:"false",message:"User not found!"})
    }

    const isPassword=await user.isPasswordCheck(password)
    if(!isPassword){
        return res.status(401).json({success:"false",message:"Invalid creditionals!"})
    }

    const accessToken=user.generateAccessToken();

    const loggedInUser=await User.findById(user._id).select(
        "-password"
    )

    const options={
        httpOnly:true,
        secure:true,
        sameSite: 'None'
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .json({
            success:true,
            user:loggedInUser,
            message:"User logged in successfully"
        })
})

const googleLogin=asyncHandler(async (req,res)=>{
    const {code}=req.query;
    const googleRes=await oauth2client.getToken(code)
    oauth2client.setCredentials(googleRes.tokens)

    const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

    if(!userRes){
        return res.status(500).json({success:"false",message:"google api Error!"})
    }

    const {email,name:fullName}=userRes.data
    let user=await User.findOne({email})

    if(!user){
        const randomPassword = crypto.randomBytes(16).toString('hex');
        user=await User.create({
            fullName,
            password:randomPassword,
            email,
        })
    }
    const accessToken=user.generateAccessToken();

    const options={
        httpOnly:true,
        secure:true,
        sameSite: 'None'
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .json({
        success:true,
        user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
        },
        message:"User signed in successfully"
    })

})

const logoutUser=asyncHandler(async (req,res)=>{
    const user=req.user;

    if(!user){
        return res.status(400).json({success:"false",message:"user authorization failed"})
    }

    const options={
        httpOnly:true,
        secure:true,
        sameSite: 'None'
    }

    return res.status(201)
    .clearCookie("accessToken",options)
    .json({success:true,message:"user logged out successsfully"})
})

const getUserDetails=asyncHandler(async (req,res)=>{
    return res.status(200)
    .json({
        success:true,
        user:{
            _id:req.user._id,
            fullName:req.user.fullName,
            email:req.user.email,
        },
        message:"User details fetched successfully"
    })
})

export {
    registerUser,
    login,
    googleLogin,
    logoutUser,
    getUserDetails
}