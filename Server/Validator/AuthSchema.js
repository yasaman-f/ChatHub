const joi = require("@hapi/joi")
const Error = require("http-errors")


const AuthSchema = joi.object({
    FirstName: joi.string().min(3).max(15).error(Error.BadRequest("FirstName must be between 3-15 char")),
    LastName: joi.string().min(3).max(15).error(Error.BadRequest("LastName must be between 3-15 char")),
    UserName: joi.string().min(3).max(15).error(Error.BadRequest("UserName must be between 3-15 char")),
    Email: joi.string().email().error(Error.BadRequest("EmailAddress is incorect"))
})


module.exports = {
    AuthSchema
}