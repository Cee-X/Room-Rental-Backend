import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Room } from "../models/Room";

export const createBooking = async (req: AuthenticateRequest, res: Response) => {
    try{
        const { room, startDate, endDate } = req.body;
        const user = req.user._id;
        if( new Date(startDate) >= new Date(endDate)) return res.status(400).json({message: 'End date must be after start date'})
        const roomDetails = await Room.findById(room);
        if(!roomDetails) return res.status(404).json({message: 'Room not found'})
       const bookingExists = await Booking.findOne({room, startDate: {$lte: endDate}, endDate: {$gte: startDate}})
        
        if( roomDetails.status === 'booked') return res.status(400).json({message: 'Room is already booked, please select another room'})
        const totalPrice = roomDetails.price
        const booking = new Booking({room,user,startDate, endDate, totalPrice, isActive: true})
        await booking.save();
        roomDetails.status = 'booked';
        await roomDetails.save();
        res.status(201).json({message: 'Booking created successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

interface AuthenticateRequest extends Request {
    user?: any
}

export const getUserBookings = async (req: AuthenticateRequest, res: Response) => {
    try{
        const booking = await Booking.find({user: req.user._id}).populate('room')
        res.json(booking)
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}


export const cancelBooking = async (req: AuthenticateRequest, res: Response) => {
    try{
        const booking = await Booking.findById(req.params.id)
        if(!booking) return res.status(404).json({message: 'Booking not found'})
        if(booking.user.toString() !== req.user._id.toString()) return res.status(403).json({message: 'Unauthorized access! You are not allowed to perform this operation'})
        await Booking.deleteOne({ _id: req.params.id });
        const room = await Room.findById(booking.room);
        if(room){
            room.status = 'available';
            await room.save();
        }
        res.json({message: 'Booking cancelled successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}