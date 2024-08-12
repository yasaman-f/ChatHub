const Controller = require("../Controller");
const { AuthSchema } = require("../../Validator/AuthSchema");
const { StatusCodes:HttpStatus} = require("http-status-codes");
const { UserModel } = require("../../Model/User");
const Error = require("http-errors");
const { NumberMaker } = require("../../Utils/Function");


class AuthUser extends Controller{
    async SignUp(req, res, next) {
        try {          
           await AuthSchema.validateAsync(req.body)
           const { FirstName, LastName, UserName, Email } = req.body
           const findUser = await UserModel.findOne({where: {Email: Email}})
           
           if(findUser.IsVerified == true){              
              throw new Error.BadRequest("This Email already exist.")
            }else{
              await UserModel.destroy({where: {Email: Email}})
              await UserModel.create({FirstName, LastName, UserName, Email})
            }
            const code = NumberMaker()
            await UserModel.update(
              {OTP: code, expire: (new Date().getTime() + 120000)}, 
              {
                  where: {
                    Email: Email 
                  }
              }
          );
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
}

module.exports = {
    AuthUser: new AuthUser()
}