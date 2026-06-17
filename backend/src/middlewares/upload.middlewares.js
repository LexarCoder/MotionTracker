const multer = require("multer")
const storage = multer.memoryStorage()


const upload = multer({storage:storage, limits:{
    fileSize:1024 * 1024 *10 // Only 5MB  data allow 
}})



module.exports = upload