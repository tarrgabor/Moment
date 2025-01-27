const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostsReport = db.define('postsreport', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    reportID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    postID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {PostsReport};