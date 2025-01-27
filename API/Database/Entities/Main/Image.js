const db = require("../../database");
const { DataTypes } = require('sequelize');

const Image = db.define('image', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    path: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = {Image};