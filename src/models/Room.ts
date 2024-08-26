
import { model, Schema, Document} from 'mongoose';

interface IRoom extends Document {
    title: string;
    roomType: string;
    roomNumber: string;
    description : string;
    price : number;
    capacity : number;
    size : number;
    pets : boolean;
    location : string;
    address : string;
    images : string[];
    amenities : string[];
    rating : number;
    isTopOffer : boolean;
    status : 'available' | 'booked';
}


const RoomSchema = new Schema<IRoom>({
    title: { type: String, required: true },
    roomType: { type: String, required: true },
    roomNumber: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    size: { type: Number, required: true },
    pets: { type: Boolean, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    images: { type: [String], required: true },
    amenities: { type: [String], required: true },
    rating: { type: Number, default: 0},
    isTopOffer: {type: Boolean, default: false},
    status : {type: String, enum: ['available', 'booked'], default: 'available'}
})

export const Room = model<IRoom>('Room', RoomSchema);

