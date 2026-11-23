import mongoose from "mongoose";
import { config } from "./config.js";
const connectDB = async () => {
  const mongoUri = config.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}
export default connectDB;