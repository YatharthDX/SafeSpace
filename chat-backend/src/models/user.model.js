import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "student",
    },
    // created_at: {
    //   type: String,
    // },
    // updated_at: {
    //   type: String,
    // },
  },
  { timestamps: false }
);

const User = mongoose.model("User", userSchema,"users");

export default User;
