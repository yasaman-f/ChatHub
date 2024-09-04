const { UserModel } = require("../Model/User");
const jwt = require("jsonwebtoken")
const Error = require("http-errors");
const crypto = require("crypto")


function NumberMaker() {
    return Math.floor((Math.random() * 90000) + 10000)
}

function AccessToken(Id, secretKey) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findOne({where: {id: Id}})
        const payload = {
          email: user.Email
        };
        const options = {
            expiresIn: "15m"
        };
                
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) reject(Error.InternalServerError("Internal Server Error😬"));
            resolve(token)
        })
    })
}


function hashPassword(pass) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(pass, salt, 1000, 64, "sha512").toString('hex')
    const newHash = `$QJHiWe@jwOkd.${salt}.${hash}`
    return newHash 
}


module.exports = {
    NumberMaker,
    AccessToken,
    hashPassword
}