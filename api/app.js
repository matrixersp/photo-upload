const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')

const app = express();

const dirPath = 'uploads/'
if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)

app.use(cors())
app.use('/photos/upload', express.static(__dirname + '/uploads'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePrefix + '-' + file.originalname)
    }
})
const upload = multer({ storage })

app.post('/photos/upload', upload.single('photo'), function (req, res, next) {
    // console.log(req.file)
    return res.send(req.file.filename);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  {
    console.log(`Server listening on port ${PORT}`)
})