import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AunthenticatedRequest extends Request {
    user? : any
}

export const authenticate = async(req: AunthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token) return res.status(401).json({error: "No token provided"})
    try{
        const decoded : any = jwt.verify(token, 'your-secret-key');
        const user = await User.findById(decoded.id)
        if(!user) return res.status(404).json({message: 'User not found'})
        req.user = user;
        next()
    }catch(error){
        res.status(401).json({error: 'Invalid token'})
    }
}

export const isAdmin = (req: AunthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user.isAdmin) return res.status(403).json({message: 'Unauthorized access! Only admins are allowed to perform this operation'})
    next()
}