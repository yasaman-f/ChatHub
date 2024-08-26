const Controller = require("../Controller");
const { AuthSchema, otpSchema } = require("../../Validator/AuthSchema");
const { StatusCodes:HttpStatus} = require("http-status-codes");
const { UserModel } = require("../../Model/User");
const Error = require("http-errors");
const { NumberMaker, AccessToken } = require("../../Utils/Function");
const path = require("path")
const { sendCode } = require("../../Module/Mail/NodeMailer");
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const otp = process.env.OTP_TOKEN


class AuthUser extends Controller{
    async SignUp(req, res, next) {
        try {          
           await AuthSchema.validateAsync(req.body)
           
           const { FirstName, LastName, UserName, Email } = req.body
           
           const findUser = await UserModel.findOne({where: {Email: Email}})
           
           if(findUser?.IsVerified == true){              
              throw new Error.BadRequest("This Email already exist.")
            }else{
              await UserModel.destroy({where: {Email: Email}})
              await UserModel.create({FirstName, LastName, UserName, Email})              
            }
            const user = await UserModel.findOne({where: {Email: Email}})            
            
            const access = await AccessToken(user.id, otp)
            res.cookie('Check-OTP-Token', access, {maxAge: 43200000 })
            const code = NumberMaker()
            await UserModel.update(
              {OTP: code, expire: (new Date().getTime() + 120000)}, 
              {
                  where: {
                    Email: Email 
                  }
              }
          );
           sendCode(Email, code)
           return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            data: {
              message: "The account was created successfully",
            },
          });
        } catch (error) {
            next(error)
        }
    }
    async checkOtp(req, res, next){
      try {
        await otpSchema.validateAsync(req.body)
        const { OTP } = req.body
           
        const findUser = await UserModel.findOne({where: {Email: req.user.Email}})
        if(!(findUser.OTP == OTP)){
          throw new Error.BadRequest("OTP is not true")
        }
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {
            message: "Everything is true you can continue",
          },
        });

      } catch (error) {
        next(error)
      }
    }
}

module.exports = {
    AuthUser: new AuthUser()
}