import dotenv from 'dotenv';
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL);
export default mongoose;
