const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");
const Doctor = require("./doctor");

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Doctor,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
        allowNull: false,
    },
});

module.exports = Appointment;