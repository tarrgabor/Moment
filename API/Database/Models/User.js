const db = require("../database");
const { DataTypes } = require('sequelize');

const User = db.define('user', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(18),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
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
    followerCount:  {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    followedCount:  {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["active", "inactive", "banned"],
        defaultValue: "active",
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    restoreCode: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    }
});

module.exports = {User};