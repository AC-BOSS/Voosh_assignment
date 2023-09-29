const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    phone: String,
    password:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);