const NameSpaceSocketHandler = require("../Socket.io/NameSpaceSocket")

module.exports = {
    socketHandler: (io) => {
        new NameSpaceSocketHandler(io).initConnection()
    }
}


