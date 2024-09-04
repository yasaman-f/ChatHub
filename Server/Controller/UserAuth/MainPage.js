const Controller = require("../Controller");
const { AuthSchema, otpSchema, prowordSchema } = require("../../Validator/AuthSchema");
const { StatusCodes:HttpStatus} = require("http-status-codes");
const { UserModel } = require("../../Model/User");
const Error = require("http-errors");
const { NumberMaker, AccessToken, hashPassword } = require("../../Utils/Function");
const path = require("path")
const fs = require("fs")
const { sendCode } = require("../../Module/Mail/NodeMailer");
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const otp = process.env.OTP_TOKEN
const proword = process.env.PROWORD_TOKEN


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

        res.clearCookie('Check-OTP-Token');
        const access = await AccessToken(findUser.id, proword)
        res.cookie('PROWORD-Token', access, {maxAge: 43200000 })

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
    async CompleteUserInformation (req, res, next){
      try {
        await prowordSchema.validateAsync(req.body)
        let { Password, fileUploadPath, filename } = req.body

        req.body.image = path.join(fileUploadPath, filename)
        req.body.image = req.body.image?.replace(/\\/g, "/")
        req.body.image = `http://localhost:3001/${req.body.image}`

        const findUser = await UserModel.findOne({where: {Email: req.user.Email}}) 
        Password = hashPassword(Password)


        await UserModel.update(
          {Profile: req.body.image, Password: Password }, 
          {
              where: {
                Email: findUser.Email 
              }
          }
      );
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {
            message: "User totally created",
          },
        });


      } catch (error) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.filename)
        req.body.image = req.body.image?.replace(/\\/g, "/")
        console.log(req.body.image);
        

        let filePath = path.join(__dirname, '../../../Public');
        filePath = `${filePath}/${req.body.image}`

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error removing file: ${err}`);
              return;
            }
          
            console.log(`File ${filePath} has been successfully removed.`);
          });
          next(error)
      }
    }
}

module.exports = {
    AuthUser: new AuthUser()
}