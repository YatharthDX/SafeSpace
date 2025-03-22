import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }
    // Simple base64 decode without verification
    const parts = token.split('.');
    if (parts.length !== 3) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token Format" });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    if (!payload.sub) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    const user = await User.findOne({ email: payload.sub }).select("-password -profile_picture");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (payload.role) {
      user.role = payload.role;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
