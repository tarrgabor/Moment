const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostReport = db.define('postreport', {
    reportID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
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
            fields: ['reportID', 'userID', 'postID']
        }]
});

module.exports = {PostReport};