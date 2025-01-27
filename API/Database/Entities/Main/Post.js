const db = require("../../database");
const { DataTypes } = require('sequelize');

const Post = db.define('post', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
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
});

module.exports = {Post};