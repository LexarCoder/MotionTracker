const imageKit = require("@imagekit/nodejs").default


const client = new imageKit({
    privateKey: process.env.IMG_PRIVATEKEY
})


async function uploadFile({ buffer, filename, folder = "" }) {
    const file = await client.files.upload({
        file: buffer,
        fileName: filename,
        folder,
    });

    return file;
}``

module.exports = {uploadFile}