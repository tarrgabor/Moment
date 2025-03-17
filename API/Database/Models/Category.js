const db = require("../database");
const { DataTypes } = require('sequelize');

const Category = db.define('categorie', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

module.exports = {Category};