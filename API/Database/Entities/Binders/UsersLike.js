const db = require("../../database");
const { DataTypes } = require('sequelize');

const UsersLike = db.define('userslike', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    postID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {UsersLike};