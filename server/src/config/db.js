import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
   console.log("MONGO_URI:", process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
}
