const db = require("../database");
const { DataTypes } = require('sequelize');

const CommentLike = db.define('commentlike', {
    userID: {
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
        fields: ["userID", "commentID"]
    }]
});

module.exports = {CommentLike};