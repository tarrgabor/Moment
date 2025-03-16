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
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(60),
        validate: {
            isEmail: true
        },
        allowNull: false,
        unique: true
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
    profilePicture: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        values: ["allowed", "banned"],
        defaultValue: "allowed",
        allowNull: false
    }
});

module.exports = {User};