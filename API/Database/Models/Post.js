const db = require("../database");
const { DataTypes } = require('sequelize');

const Post = db.define('post', {
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
    title: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(600),
        allowNull: true
    },
    categoryID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    visible: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
});

module.exports = {Post};