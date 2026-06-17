const {Router} = require("express")
const router = Router()
const AuthController = require("../controllers/auth.controller")
const userIdentify= require("../middlewares/auth.middleware")


// Register 
router.post("/register", AuthController.registerUserController )
// Login
router.post("/login", AuthController.loginUserController )
// Get dat
router.get("/getme", userIdentify, AuthController.getMEUserController )

// LogOut

router.get("/logout", userIdentify, AuthController.logOutUserController)



module.exports= router