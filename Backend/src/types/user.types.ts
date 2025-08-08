import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
   _id: ObjectId
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  otp?: string | null;
  otpExpires?: Date | null;
  isVerified?: Boolean;
  refreshToken?: string
}
