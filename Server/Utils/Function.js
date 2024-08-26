const { UserModel } = require("../Model/User");
const jwt = require("jsonwebtoken")
const Error = require("http-errors");


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
            expiresIn: "3m"
        };
                
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) reject(Error.InternalServerError("Internal Server Error😬"));
            resolve(token)
        })
    })
  }

module.exports = {
    NumberMaker,
    AccessToken
}