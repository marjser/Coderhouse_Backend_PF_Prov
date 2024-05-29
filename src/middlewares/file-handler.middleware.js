function fileHandler (req, file, res, next) {
    console.log('fileHandler')
    console.log(req)

    next()
}

module.exports = fileHandler