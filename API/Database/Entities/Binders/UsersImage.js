const db = require("../../database");
const { DataTypes } = require('sequelize');

const UsersImage = db.define('usersimage', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    userID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    imageID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {UsersImage};