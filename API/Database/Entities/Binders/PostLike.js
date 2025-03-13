const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostLike = db.define('postlike', {
    postID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
            unique: true,
            fields: ['postID', 'userID']
        }]
});

module.exports = {PostLike};