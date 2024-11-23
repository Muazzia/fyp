const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const StoryAdvertisement = sequelize.define("storyAdvertisement", {
  id: {
    type: DataTypes.UUID, // Use UUID for a unique product ID
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyImage: {
    type: DataTypes.STRING,
    allowNull: false, // Product must have a name
  },
  companyName: {
    type: DataTypes.STRING, // Detailed description of the product
    allowNull: false,
  },
  storyImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isViewd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = StoryAdvertisement;
