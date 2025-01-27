const db = require("../../database");
const { DataTypes } = require('sequelize');

const UsersComment = db.define('userscomment', {
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
    commentID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {UsersComment};