const joi = require("@hapi/joi")
const Error = require("http-errors")


const AuthSchema = joi.object({
    FirstName: joi.string().min(3).max(15).error(Error.BadRequest("FirstName must be between 3-15 char")),
    LastName: joi.string().min(3).max(15).error(Error.BadRequest("LastName must be between 3-15 char")),
    UserName: joi.string().min(3).max(15).error(Error.BadRequest("UserName must be between 3-15 char")),
    Email: joi.string().email().error(Error.BadRequest("EmailAddress is incorect"))
})

const otpSchema = joi.object({
    OTP: joi.string().min(5).max(6).error(Error.BadRequest("OTP must be 5-6 char")),
})

module.exports = {
    AuthSchema,
    otpSchema
}