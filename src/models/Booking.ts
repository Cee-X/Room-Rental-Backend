
import { Schema, model, Document} from 'mongoose';

interface IBooking extends Document {
    room: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalPrice: number;  
    
}

const BookingSchema = new Schema<IBooking>({
    room: {type: Schema.Types.ObjectId, ref: 'Room', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    totalPrice: {type: Number, required: true},
   
})

export const Booking = model<IBooking>('Booking', BookingSchema);