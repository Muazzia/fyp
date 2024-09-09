const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");

const Scan_Data = sequelize.define("Scan_Data", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    percentage: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    }
});


module.exports = Scan_Data