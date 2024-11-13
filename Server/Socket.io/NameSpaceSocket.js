const { Namespace } = require("../Controller/Chat/Namespace");
const { checkTokenSocket } = require("../Middleware/CheckToken");
const { ConversationModel } = require("../Model/Conversation");


module.exports = class NameSpaceSocketHandler {
    #io;
    constructor(io) {
        this.#io = io;
        this.userData = {};
    }

    initConnection() {
        this.#io.on('connection', (socket) => {
            console.log('User connected');

            socket.on('pastInfo', async () => {
                let req = { 
                    cookies: socket.handshake.headers.cookie, 
                    path: "/addNamespace" 
                };                
                
                if (req.cookies) {
                    const cookies = req.cookies.split('; ');
                    req.cookies = {};
                    for (let cookie of cookies) {
                        const [name, value] = cookie.split('=');
                        req.cookies[name] = value;                        
                    }
                }

                const user = await checkTokenSocket(req, socket);

                if (!user) {
                    return;          
                }

                req.user = user;  
                this.userData = user;

                const findConversation = await ConversationModel.findAll({ where: { User: user.id } });

                socket.emit("firstRes", findConversation);
                
            });

            socket.on('addNamespace', async (data) => {
                console.log('addNamespace event received');
            
                let req = { 
                    body: { Namespace: data.Namespace, Description: data.Description }, 
                    cookies: socket.handshake.headers.cookie, 
                    path: "/addNamespace" 
                };
                
                if (req.cookies) {
                    const cookies = req.cookies.split('; ');
                    req.cookies = {};
                    for (let cookie of cookies) {
                        const [name, value] = cookie.split('=');
                        req.cookies[name] = value;
                    }
                }
            
                const user = await checkTokenSocket(req, socket);
            
                if (!user) {
                    return;          
                }
            
                req.user = user;  
                this.userData = user;
            
                try {
                    const newNamespace = await Namespace.AddNamespace(req, socket);
                    setTimeout(async () => {
                        const findConv = await ConversationModel.findOne({ where: { Namespace: data.Namespace } });                    
                        if (findConv) {                            
                            socket.emit("namespaceAdded", findConv); 
                        }
                    }, 2000);
                } catch (error) {
                    console.error('Error saving namespace:', error);
                    socket.emit("saveError", { error: "Error saving namespace to the database" });
                }
            });   
            
            socket.on('getFriendsList', async () => {
                const friends = await getFriendsListFromDB(this.userData.id); 
                socket.emit('FriendsListResponse', friends);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
}

async function getFriendsListFromDB(userId) {
    await ConversationModel.findAll({ where: { User: userId } })
}

