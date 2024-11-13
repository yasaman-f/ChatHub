const { AuthRoutes } = require("./User/Auth")
const { ChatRoutes } = require("./User/Chat.routes")

const router = require("express").Router()

router.use("/api/register", AuthRoutes)
router.use("/api/chatHub", ChatRoutes)


module.exports = {
    AllRoutes: router
}