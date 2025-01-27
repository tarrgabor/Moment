const db = require("../../database");
const { DataTypes } = require('sequelize');

const Report = db.define('report', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
});

module.exports = {Report};