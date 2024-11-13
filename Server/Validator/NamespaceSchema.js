const joi = require("@hapi/joi")
const Error = require("http-errors")


const AddNamespace = joi.object({
    Namespace: joi.string().min(3).max(15).error(Error.BadRequest("Namespace must be between 3-15 char")),
    Description: joi.string().min(3).max(30).error(Error.BadRequest("Description must be between 3-30 char")),
})

const AddImage = joi.object({
    filename: joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(Error.BadRequest("The filename incorrect")),
    fileUploadPath : joi.allow()
})


module.exports = {
    AddNamespace,
    AddImage
}