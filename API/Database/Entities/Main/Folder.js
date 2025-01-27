const db = require("../../database");
const { DataTypes } = require('sequelize');

const Folder = db.define('folder', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

module.exports = {Folder};