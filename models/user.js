const mongoose = require("mongoose");

//schemas
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username Taken"],
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
        unique: [true, "Address linked to another account"],
    },
})

const User = mongoose.model("User", userSchema);
module.exports = User;