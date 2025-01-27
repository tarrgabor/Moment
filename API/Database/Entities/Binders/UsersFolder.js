const db = require("../../database");
const { DataTypes } = require('sequelize');

const UsersFolder = db.define('usersfolder', {
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
    folderID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {UsersFolder};