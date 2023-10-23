import dotenv from 'dotenv';
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
import mongoose from "mongoose";
import { serverLogger } from './logger.js';

mongoose.connect(process.env.MONGODB_URL);
serverLogger.info(`Database ${process.env.NODE_ENV} connected`);
export default mongoose;
