const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const PasswordResetOtp = sequelize.define("PasswordResetOtp", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
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


module.exports = PasswordResetOtp