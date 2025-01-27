const db = require("../../database");
const { DataTypes } = require('sequelize');

const User = db.define('user', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(60),
        validate: {
            isEmail: true
        },
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ["admin", "user"],
        defaultValue: "user",
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        values: ["allowed", "banned"],
        defaultValue: "allowed",
        allowNull: false
    },
    warnings: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0,
        allowNull: false
    }
});

module.exports = {User};