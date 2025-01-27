const db = require("../../database");
const { DataTypes } = require('sequelize');

const UsersPost = db.define('userspost', {
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
    postID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {UsersPost};