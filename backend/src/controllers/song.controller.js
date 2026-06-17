const songModel = require("../model/song.model")
const id3 = require("node-id3")
const storageFile= require("../services/storage.service")


async function uploadSongController(req, res) {

const songBuffer = req.file.buffer    

const {mood} = req.body
    const tags = id3.read(songBuffer)
    const songFile= await storageFile.uploadFile({
        buffer:songBuffer,
        filename:tags.title + ".mp3",
        folder:"faceCapture/modify/songs"
    })
    
const posterFile= await storageFile.uploadFile({
    buffer:tags.image.imageBuffer,
    filename:tags.title + ".jpeg",
    folder: "faceCapture/modify/posters"
})

const song = await songModel.create({
    title:tags.title,
    url:songFile.url,
    posterUrl:posterFile.url,
    mood
})


res.status(201).json({
    message:"song created successfully...",
    song
})


}

async function getSongs(req, res) {
    
    const {mood} = req.query
    const song = songModel.findOne({mood})

res.status(200).json({
    message:"Song Featch Successfully",
    song

})

}



module.exports ={
    uploadSongController,
    getSongs
}