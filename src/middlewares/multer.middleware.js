const multer = require('multer')
const fs = require('fs')
const fsConfig = require('../configs/fs.config')

if (!fs.existsSync(fsConfig.documents)) {
    fs.mkdirSync(fsConfig.documents);
}
if (!fs.existsSync(fsConfig.profile)) {
    fs.mkdirSync(fsConfig.profile);
}
if (!fs.existsSync(fsConfig.products)) {
    fs.mkdirSync(fsConfig.products);
}



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRaw = req.url

    const pathOk = pathRaw.split('/')
    
    let pathOutput

    if (pathOk[2] === 'documents') {
        pathOutput = fsConfig.documents
    }
    if (pathOk[1] === 'products') {
        pathOutput = fsConfig.products
    }
    if (pathOk[1] === 'profile') {
        console.log('profile')
        pathOutput = fsConfig.profile
    }
    

    cb(null, pathOutput);
  },
  filename: function (req, file, cb) {

    const { uid } = req.params
    const {fieldname} = file
    const originalName = file.originalname.replace(/\s/g, "");
    const fileDataArray = ['userId:',uid,'-','document:',fieldname,'-']
    const fileData = fileDataArray.join("")
    cb(null, Date.now()+'-'+originalName)

  
  }  
})

const upload = multer({ storage: storage });

module.exports = upload


