const db = require("../database");
const { DataTypes } = require('sequelize');

const Reply = db.define('replie', {
    commentID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    replyID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ["commentID", "replyID"]
    }]
});

module.exports = {Reply};