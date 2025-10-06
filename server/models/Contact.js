import mongoose from "mongoose";
import { isValidPhoneNumber } from "libphonenumber-js";

const contactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return isValidPhoneNumber(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
  idUser: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
