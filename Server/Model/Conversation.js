const { Sequelize, DataTypes } = require('sequelize');
const { UserModel } = require('./User');
const sequelize = new Sequelize('postgres://ChatHub:A8XqYEWSVFRgBth@localhost:5432/ChatHub_DB',{
    logging: false
});

const Message = sequelize.define('Message', {
    senderId: { type: DataTypes.UUID, allowNull: false, references: { model: UserModel, key: 'id' }},
    message: { type: DataTypes.STRING, allowNull: true },
    dateTime: { type: DataTypes.INTEGER, allowNull: true}
});

const GPS = sequelize.define('GPS', {
    senderId: { type: DataTypes.UUID, allowNull: false, references: { model: UserModel, key: 'id' }},
    location: { type: DataTypes.JSONB, defaultValue: {} },
    dateTime: { type: DataTypes.INTEGER, allowNull: true }
});

const Room = sequelize.define('Room', {
    name: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
});

Room.hasMany(Message, { foreignKey: 'roomId', onDelete: 'CASCADE' });
Room.hasMany(GPS, { foreignKey: 'roomId', onDelete: 'CASCADE' });


const Conversation = sequelize.define('Conversation', {
    Namespace: { type: DataTypes.STRING, allowNull: false },
    Description: { type: DataTypes.STRING, allowNull: false },
    ConversationProfile: { type: DataTypes.STRING },
    User : {type: DataTypes.UUID}
});

Conversation.hasMany(Room, { foreignKey: 'conversationId', onDelete: 'CASCADE' });

sequelize.sync()
    // .then(() => console.log('Database & tables created!'))
    // .catch(err => console.error('Error:', err));

module.exports = {
    ConversationModel: Conversation
};
