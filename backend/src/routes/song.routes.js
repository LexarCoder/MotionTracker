const {Router} = require("express")
const router = Router()
const songController = require("../controllers/song.controller")
const userIdentify  = require("../middlewares/auth.middleware")
const upload =require("../middlewares/upload.middlewares")

router.post("/song", userIdentify, upload.single("song"), songController.uploadSongController)

router.get("/", userIdentify, songController.getSongs)
module.exports = router