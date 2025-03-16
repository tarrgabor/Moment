const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostComment = db.define('postcomment', {
    postID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    commentID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
            unique: true,
            fields: ['postID', 'commentID']
        }]
});

module.exports = {PostComment};