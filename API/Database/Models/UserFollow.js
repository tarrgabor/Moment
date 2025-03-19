const db = require("../database");
const { DataTypes } = require('sequelize');

const UserFollow = db.define('userfollow', {
    followerID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    followedID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ["followerID", "followedID"]
    }]
});

module.exports = {UserFollow};