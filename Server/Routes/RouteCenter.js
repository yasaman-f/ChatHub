const { AuthRoutes } = require("./User/Auth")

const router = require("express").Router()

router.use("/api/register", AuthRoutes)


module.exports = {
    AllRoutes: router
}