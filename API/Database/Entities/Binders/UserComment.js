const db = require("../../database");
const { DataTypes } = require('sequelize');

const UserComment = db.define('usercomment', {
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
            fields: ['userID', 'commentID']
        }]
});

module.exports = {UserComment};