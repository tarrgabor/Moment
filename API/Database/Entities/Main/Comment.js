const db = require("../../database");
const { DataTypes } = require('sequelize');

const Comment = db.define('comment', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = {Comment};