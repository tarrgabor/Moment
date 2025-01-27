const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostsComment = db.define('postscomment', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    postID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    commentID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {PostsComment};