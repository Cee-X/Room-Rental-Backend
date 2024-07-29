import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';





export const register = async (req: Request, res: Response) => {
    const { email, password} = req.body;
    try{
        const exitingUser = await User.findOne({email});
        if(exitingUser) return res.status(400).json({message: 'User already exists'});
        const user = new User({email, password, isAdmin: false});
        await user.save();
        res.status(201).json({message: 'User created successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

export const createAdmin = async (req: Request, res: Response) => {
    const { email, password} = req.body;
    try{
        const exitingAdmin = await User.findOne({email});
        if(exitingAdmin) return res.status(400).json({message: 'Admin already exists'});
        const user = new User({email, password, isAdmin: true});
        await user.save();
        res.status(201).json({message: 'Admin created successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'User not found'});
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});
        const token = jwt.sign({id: user._id}, 'your-secret-key')
        const role = user.isAdmin ? 'admin' : 'user';
        res.json({token, role})
    }catch(error){
        res.status(400).json({message: `Error ${error}`})
    }
}

