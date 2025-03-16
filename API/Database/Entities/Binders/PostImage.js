const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostImage = db.define('postimage', {
    postID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    imageID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
            unique: true,
            fields: ['postID', 'imageID']
        }]
});

module.exports = {PostImage};