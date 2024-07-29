import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    profilePic: string;
    phoneNumber: string;
    comparePassword: (password: string) => Promise<boolean>;
}


const UserSchema = new Schema<IUser>({
    name: { type : String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    profilePic: { type: String},
    phoneNumber: { type: String, unique: true}
})

UserSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})


UserSchema.methods.comparePassword =  function (password: string){
    return bcrypt.compare(password, this.password)
}

export const User = model<IUser>('User',UserSchema)