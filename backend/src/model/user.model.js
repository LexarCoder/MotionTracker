const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email address"
            ]
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        }
    },
    {
        timestamps: true,
    });

const AuthUserModel = mongoose.model("AuthUser", userSchema);

module.exports = AuthUserModel;