const { ConversationModel } = require("../../Model/Conversation");
const { AddNamespace, AddImage } = require("../../Validator/NamespaceSchema");
const Controller = require("../Controller");
const { StatusCodes:HttpStatus} = require("http-status-codes");
const Error = require("http-errors");
const path = require("path")
const fs = require("fs");
const { UserModel } = require("../../Model/User");
const { CheckNumber } = require("../../Utils/Function");


class Namespace extends Controller {
  constructor() {
      super();
      this.namespaceData = {}; 
  }

  async AddNamespace(req, socket) {
    try {        
        await AddNamespace.validateAsync(req.body);

        const { Namespace, Description } = req.body;
        const findUser = await UserModel.findOne({ where: { Email: req.user.Email } });

        if (!findUser) {
            if (socket) {
                socket.emit('error', { message: 'User not found' });
            }
            return;
        }

        const findConversation = await ConversationModel.findAll({ where: { User: req.user.id } });
        const result = CheckNumber(findConversation, Namespace);   
        console.log(result);
             

        if (result == false) {
            if (socket) {
                socket.emit('error', { message: 'Namespace Already Exists' });
            } 
        }        

        this.namespaceData[findUser.id] = { Namespace, Description, result };


        if (socket) {
            socket.emit('namespaceAdded', { Namespace, Description });
        }

        return { Namespace, Description, result };

    } catch (error) {
        if (socket) {
            socket.emit('error', { message: error.message });
        }
        console.log('Error in AddNamespace:', error.message);
    }
}

  async AddImage(req, res, next) {
      try {
          await AddImage.validateAsync(req.body);
          const { fileUploadPath, filename } = req.body;

          
          const findUser = await UserModel.findOne({ where: { Email: req.user.Email } });
          
          if (!findUser) {
            return res.status(HttpStatus.NOT_FOUND).json({
              message: 'User not found',
            });
          }
          
          const namespaceInfo = this.namespaceData[findUser.id];   
          console.log(namespaceInfo);
                 
          
          if (namespaceInfo.result == false) {
              throw new Error.BadRequest("Namespace already exist")
          }

          if (!namespaceInfo) {
              return res.status(HttpStatus.BAD_REQUEST).json({
                  message: 'Namespace data not found. Please add it through the socket first.',
              });
          }

          req.body.image = path.join(fileUploadPath, filename);
          req.body.image = req.body.image?.replace(/\\/g, "/");
          req.body.image = `http://localhost:3001/${req.body.image}`;

          await ConversationModel.create({
              Namespace: namespaceInfo.Namespace,
              Description: namespaceInfo.Description,
              ConversationProfile: req.body.image,
              User: findUser.id
          });

          delete this.namespaceData[findUser.id];

          return res.status(HttpStatus.OK).json({
              statusCode: HttpStatus.OK,
              data: {
                  message: "The namespace's profile was created successfully",
              },
          });

      } catch (error) {
          console.log('Error in AddImage:', error.message);
          req.body.image = path.join(req.body.fileUploadPath, req.body.filename);
          req.body.image = req.body.image?.replace(/\\/g, "/");

          let filePath = path.join(__dirname, '../../../Public');
          filePath = `${filePath}/${req.body.image}`;

          fs.unlink(filePath, (err) => {
              if (err) {
                  console.error(`Error removing file: ${err}`);
                  return;
              }
              console.log(`File ${filePath} has been successfully removed.`);
          });

          next(error);
      }
  }

}



module.exports = {
    Namespace: new Namespace()
}