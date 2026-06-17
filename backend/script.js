require("dotenv").config()
const { config } = require("dotenv");
const app= require("./src/app")

const connectDb = require("./src/config/Database")

connectDb()


app.listen(3000, ()=>{
    console.log("Server is runing...");
    
})