const io = require("../../../index")
const { checkToken } = require("../../Middleware/CheckToken");
const { UploadFile } = require("../../Utils/Multer");
const { Namespace } = require("../../Controller/Chat/Namespace");

const router = require("express").Router();

router.post("/AddImage", checkToken, UploadFile.single('ConversationProfile'), Namespace.AddImage )


module.exports = {
    ChatRoutes: router
};
