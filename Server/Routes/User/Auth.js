const { AuthUser } = require("../../Controller/UserAuth/MainPage")
const { checkToken } = require("../../Middleware/CheckToken")

const router = require("express").Router()

router.post("/", AuthUser.SignUp)
router.post("/otp", checkToken, AuthUser.checkOtp)

module.exports = {
    AuthRoutes: router
}