import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, statusCode, res) {
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

    await sendTokenResponse(user, res, "User registered successfully");
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
