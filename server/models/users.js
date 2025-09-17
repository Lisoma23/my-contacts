import mongoose, { model } from "mongoose";


const UserSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        unique: true,
    },
    createAt: {
        type: Date,
        require: true
    }
});


const User = mongoose.model('User', UserSchema)
module.exports = User;