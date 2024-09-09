const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Order = require('./order');
const Product = require('./product');

const OrderedProducts = sequelize.define('OrderedProducts', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
        onDelete: "CASCADE"

    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Product,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = OrderedProducts;
