import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, statusCode, res,message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);
  res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}
export const register = async (req, res) => {
  
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({ email, contact, password, fullname, role: isSeller ? "seller" : "buyer" });

    await sendTokenResponse(user, 201, res,"User registered successfully");
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const {email,password} = req.body;
  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(400).json({message:"Invalid email"});
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid password"});
    }

    await sendTokenResponse(user,200,res,"User logged in successfully");
  }
  catch(error){
    res.status(500).json({ message: "Internal server error" });
  }
}