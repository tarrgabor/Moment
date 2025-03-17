const db = require("../database");
const { DataTypes } = require('sequelize');

const PostLike = db.define('postlike', {
    userID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    postID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ["userID", "postID"]
    }]
});

module.exports = {PostLike};