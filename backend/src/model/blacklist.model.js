const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")

const blackListSchema = new mongoose.Schema({

    token:{
        type:String,
        required:[true, "Token is required for black listing "]
    }
},
    {
        timestamps: true
    }) 
const blackListModel = mongoose.model("blackList", blackListSchema)

module.exports = blackListModel