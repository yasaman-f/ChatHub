const { AuthUser } = require("../../Controller/UserAuth/MainPage")

const router = require("express").Router()

router.post("/", AuthUser.SignUp)

module.exports = {
    AuthRoutes: router
}