const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://ChatHub:A8XqYEWSVFRgBth@localhost:5432/ChatHub_DB',{
    logging: false
});

const User = sequelize.define('User', {
    FirstName: {type: DataTypes.STRING, allowNull: false},
    LastName: {type: DataTypes.STRING, allowNull: false},
    UserName: {type: DataTypes.STRING, allowNull: false},
    Email: {type: DataTypes.STRING, allowNull: false},
    Password: {type: DataTypes.STRING},
    OTP: {
        type: DataTypes.JSONB,
        defaultValue: {
            code: 0,
            expire: 0
        }
    },
    Profile: {type: DataTypes.STRING},
    Role  : { type: DataTypes.STRING, defaultValue: "USER" },
    IsVerified  : { type: DataTypes.BOOLEAN, defaultValue: true },
});

sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.error('Error:', err));


module.exports = {
    UserModel: User
}