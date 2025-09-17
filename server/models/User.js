import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
        require: true,
    }
});

const User = mongoose.model('User', UserSchema)
export default User;