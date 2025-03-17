const db = require("../database");
const { DataTypes } = require('sequelize');

const RestoreCode = db.define('restorecode', {
    email: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    }
});

module.exports = {RestoreCode};