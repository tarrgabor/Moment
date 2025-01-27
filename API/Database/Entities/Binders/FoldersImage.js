const db = require("../../database");
const { DataTypes } = require('sequelize');

const FoldersImage = db.define('foldersimage', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    folderID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    imageID: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = {FoldersImage};