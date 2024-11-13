const jwt = require("jsonwebtoken")
const Error = require("http-errors")
const path = require("path");
const { UserModel } = require("../Model/User");
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const otp = process.env.OTP_TOKEN
const proword = process.env.PROWORD_TOKEN
const info = process.env.USER_INFO


function getToken(params) {
    const [bearer, token] = params?.split(" ")|| []
    if(["Bearer", "bearer" && token].includes(bearer)) return token
    throw Error.Unauthorized("user not found. please Sign up/Login")
}

function checkToken(req, res, next) {
    try {
        let TokenName;
        let secretKey;
        const path = req.path;

        if( path == "/otp" ){

            TokenName = "Check-OTP-Token"
            secretKey = otp   

        }else if( path == "/proword" ){

            TokenName = "PROWORD-Token"
            secretKey = proword  

        }else if( path == "/AddImage" ){

            TokenName = "User-Info"
            secretKey = info  

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

async function checkTokenSocket(req, socket) {
    try {
        let TokenName;
        let secretKey;
        const path = req.path;

        if (path === "/addNamespace") {
            TokenName = "User-Info";
            secretKey = info;
        }

        const cooki = `Bearer ${req.cookies[TokenName]}`;
        const token = getToken(cooki);

        const payload = await new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    socket.emit('error', { message: err.message });
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        const { email } = payload || {};
        const user = await UserModel.findOne({
            where: { Email: email },
            attributes: { exclude: ['Password', 'OTP'] }
        });

        if (!user) {
            socket.emit('error', { message: "User not found.😬" });
            return null;
        }

        req.user = user;
        console.log("Token is valid, emitting tokenValidated"); 
        socket.emit('tokenValidated', user);

        return user;

    } catch (error) {
        socket.emit('error', { message: error.message });
        console.log(error.message);
        return null;
    }
}




module.exports = {
    checkToken,
    checkTokenSocket
}