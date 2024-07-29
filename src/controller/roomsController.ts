import { Request , Response } from 'express';
import { Room } from '../models/Room';





export const createRoom = async (req: Request, res: Response) => {
    try{
        const images = (req.files as Express.Multer.File[]).map((file: any) => {
            if(!file.cloudStoragePublicUrl){
                console.log('Missing cloud storage url')
                return null
            }
            return file.cloudStoragePublicUrl
        })
        const amenities = Array.isArray(req.body.amenities) ? req.body.amenities : JSON.parse(req.body.amenities);
        const room = new Room({...req.body, images, amenities});
        await room.save();
        res.json({message: 'Room created successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}


export const getRooms = async (req: Request, res: Response) => {
    try{
        const rooms = await Room.find();
        res.json(rooms)
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}


export const getRoomById = async (req: Request, res: Response) => {
    try{
        const room = await Room.findById(req.params.id)
        if(!room) return res.json({message: 'Room not found'})
        res.json(room)
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}




export const updateRoom = async (req : Request, res: Response) => {
    try{
        const images = (req.files as Express.Multer.File[]).map((file: any) => file.cloudStoragePublicUrl)
        const amenities = Array.isArray(req.body.amenities) ? req.body.amenities : JSON.parse(req.body.amenities);
        const room = await Room.findByIdAndUpdate(req.params.id, {...req.body, images, amenities}, {new: true})
        if(!room) return res.json({message: 'Room not found'})
        res.json({message: 'Room updated successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try{
        const room = await Room.findByIdAndDelete(req.params.id)
        if(!room) return res.status(404).json({message: 'Room not found'})
        res.json({message: 'Room deleted successfully'})
    }catch(error){
        res.json({message: `Error ${error}`})
    }
}

export const getTopOfferRooms = async( req: Request, res: Response) => {
    try{
        const rooms = await Room.find({isTopOffer : true}).limit(10);
        res.json(rooms)

    }catch(error){
        res.json({error: error})
    }
}



export const searchRooms = async (req: Request, res: Response)  => {
    try{
        const {priceMin, priceMax, location, sort } = req.query
        const filters : any = {}
        if(priceMin || priceMax){
            filters.price = {}
            if(priceMin) filters.price.$gte = Number(priceMin) 
            if(priceMax) filters.price.$lte = Number(priceMax)
        }
        if(location){
            filters.location = {$regex: location, $options: 'i'}
        }
        
        const sortOption: any = {}
        if(sort) {
            const [field, order] = (sort as string).split(':')
            sortOption[field] = order === 'asc' ? 1 : -1;
        }
        
        const rooms = await Room.find(filters).sort(sortOption);
        if(!rooms) return res.json({message: 'No rooms found'})
        res.json(rooms)

    }catch(error){
        res.json({error: error})
    }
} 