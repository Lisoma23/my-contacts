import mongoose from "mongoose";
import { isValidPhoneNumber } from "libphonenumber-js";

const contactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "User firstname required"],
  },
  lastname: {
    type: String,
    required: [true, "User lastname required"],
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
  idUser: {
    type: String,
    required: [true, "idUser required"],
  },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
