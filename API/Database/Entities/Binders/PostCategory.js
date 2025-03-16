const db = require("../../database");
const { DataTypes } = require('sequelize');

const PostCategory = db.define('postcategorie', {
    postID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    categoryID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    }
}, {
    indexes: [{
            unique: true,
            fields: ['postID', 'categoryID']
        }]
});

module.exports = {PostCategory};