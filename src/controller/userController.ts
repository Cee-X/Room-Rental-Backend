import { Request, Response } from 'express';
import { User } from '../models/User';


export interface AuthenticateRequest extends Request {
    user?: any
}

export const getUserProfile = async (req: AuthenticateRequest, res: Response) => {
    try{
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({message: 'User not found'})
        res.json(user)
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

export const updateUserProfile = async (req: AuthenticateRequest, res: Response) => {
    try{
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({message: 'User not found'})
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        console.log(req.file)
        if(req.file && (req.file as any).cloudStoragePublicUrl){
            user.profilePic = (req.file as any).cloudStoragePublicUrl
        }else{
            console.log('No file uploaded')
        }
        const updatedUser = await user.save();
        res.json(updatedUser)
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

export const deleteUser = async (req: AuthenticateRequest, res: Response) => {
    try{
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({message: 'User not found'})
        await user.deleteOne()
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}