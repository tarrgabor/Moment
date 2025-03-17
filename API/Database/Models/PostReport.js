const db = require("../database");
const { DataTypes } = require('sequelize');

const PostReport = db.define('postreport', {
    userID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    postID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ["userID", "postID"]
    }]
});

module.exports = {PostReport};