const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID, // Use UUID for a unique product ID
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Product must have a name
  },
  description: {
    type: DataTypes.TEXT, // Detailed description of the product
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // e.g., cream, lotion, etc.
    allowNull: false,
  },
  skinCondition: {
    type: DataTypes.ARRAY(DataTypes.STRING), // To store multiple conditions like 'acne', 'dry skin', etc.
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING, // URL for product image
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Product;
