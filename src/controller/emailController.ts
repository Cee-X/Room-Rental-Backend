import { Request, Response } from "express";
import { sendEmail } from "../models/emailServer";

export const sendEmailController = async (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    if(!name || !email || !message) return res.status(400).json({message: 'All fields are required'})
    try{
        await sendEmail(name, email, message);
        res.status(200).json({message: 'Email sent successfully'})
    }catch(error){
        res.status(500).json({message: `Error ${error}`})
    }
}