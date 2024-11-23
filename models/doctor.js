const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Doctor = sequelize.define("Doctor", {
  id: {
    type: DataTypes.UUID, // Unique doctor ID
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clinicAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fees: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  specialization: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Doctor's specialty, e.g., Dermatologist
    allowNull: false,
  },
  services: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Doctor's specialty, e.g., Dermatologist
    allowNull: false,
  },
  availableDays: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  availableTimeSlots: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Available times for appointments
    allowNull: false,
  },
});

// make two columns available days and available time slots
// week days
// time slots

/* 
available time slots example data
{
  "Monday": [
    "09:00-09:30",
    "09:30-10:00",
    "10:00-10:30",
    "10:30-11:00",
    "14:00-14:30",
    "14:30-15:00",
    "15:00-15:30",
    "15:30-16:00"
  ],
  "Wednesday": [
    "12:00-12:30",
    "12:30-13:00",
    "13:00-13:30",
    "13:30-14:00"
  ]
}
*/

module.exports = Doctor;
