const { AuthUser } = require("../../Controller/UserAuth/MainPage")
const { checkToken } = require("../../Middleware/CheckToken")
const { UploadFile } = require("../../Utils/Multer")

const router = require("express").Router()

router.post("/", AuthUser.SignUp)
router.post("/otp", checkToken, AuthUser.checkOtp)
router.post("/proword", checkToken, UploadFile.single('Profile'), AuthUser.CompleteUserInformation)

module.exports = {
    AuthRoutes: router
}