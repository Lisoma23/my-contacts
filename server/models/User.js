import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "User firstname required"],
  },
  lastname: {
    type: String,
    required: [true, "User lastname required"],
  },
  email: {
    type: String,
    required: [true, "User email required"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "User phone number required"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
