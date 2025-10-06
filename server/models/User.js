import mongoose, { model } from "mongoose";
import { isValidPhoneNumber } from "libphonenumber-js";

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
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, "User email required"],
    unique: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return isValidPhoneNumber(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required"],
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
