const express = require("express")
const cookieParser = require("cookie-parser")
const AuthRouter = require("./routes/auth.routes")
const songRouter = require("./routes/song.routes")
const cors = require("cors")
const app = express()
app.set("trust proxy", 1);

// middelares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://motiontracker.vercel.app",
    credentials: true
}));

// Routes 
app.use("/auth/api",AuthRouter)
app.use("/api", songRouter)


// Export App

module.exports = app
