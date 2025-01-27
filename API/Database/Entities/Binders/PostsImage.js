const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostsImage = db.define('postsimage', {
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
    imageID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {PostsImage};