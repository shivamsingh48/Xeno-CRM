import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'

export const verifyJwt=asyncHandler(async (req,res,next)=>{

    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        // console.log(token)
    
        if(!token){
            return res.status(401).json({success:"false",message:"Invalid authorization"})
        }
        
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user=await User.findById(decodedToken?._id).select("-password")
    
        if(!user){
            return res.status(401).json({success:"false",message:"Invalid access!"})
        }
    
        req.user=user
    
        next()
    } catch (error) {
        return res.status(401).json({success:"false",message:"jwt token not verified"})
    }
})