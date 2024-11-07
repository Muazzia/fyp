const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Doctor = require('./doctor');

const DoctorPasswordResetOtp = sequelize.define("DoctorPasswordResetOtp", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Doctor,
            key: "id"
        }
    },
    otp: {
        type: DataTypes.STRING,  // Storing as string since it's numeric
        allowNull: false,
    },
    expiration: {
        type: DataTypes.DATE, // Expiration date for the OTP
        allowNull: false,
    },
});


module.exports = DoctorPasswordResetOtp