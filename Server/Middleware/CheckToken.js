const jwt = require("jsonwebtoken")
const Error = require("http-errors")
const path = require("path");
const { UserModel } = require("../Model/User");
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const otp = process.env.OTP_TOKEN


function getToken(params) {
    const [bearer, token] = params?.split(" ")|| []
    if(["Bearer", "bearer" && token].includes(bearer)) return token
    throw Error.Unauthorized("user not found. please Sign up/Login")
}

function checkToken(req, res , next) {
    try {
        let TokenName;
        let secretKey;
        let Errorr
        const path = req.path;
        if(path == "/otp"){
            TokenName = "Check-OTP-Token"
            secretKey = otp            
        }
        
        const cooki = `Bearer ${req.cookies[TokenName]}`
        
        const token = getToken(cooki)
            jwt.verify(token, secretKey, async(err, payload)=> {
            try {
                if(err) throw err
                const {email} = payload || {}
                const user = await UserModel.findOne({
                    where: {
                        Email: email
                    }}, {
                    attributes: {
                         exclude: ['Password', 'OTP'] 
                        }
                  })
                if (!user) throw Error.Unauthorized("User not found.😬")
                req.user = user
                return next()
            } catch (error) {
                next(error)
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    checkToken
}