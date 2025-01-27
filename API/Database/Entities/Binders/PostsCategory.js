const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostsCategory = db.define('postscategorie', {
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
    categoryID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {PostsCategory};