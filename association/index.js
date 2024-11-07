const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Order = require("../models/order");
const OrderedProducts = require("../models/orderedProducts");
const Product = require("../models/product");
const Scan_Data = require("../models/scan_data");
const User = require("../models/user");

// User with Scan_data
User.hasMany(Scan_Data, { foreignKey: "userId", as: "user" })
Scan_Data.belongsTo(User, { foreignKey: "userId", as: "user" })


// Order with Ordered Products 1-> M
OrderedProducts.belongsTo(Order, { foreignKey: "orderId", as: "orderedProducts" })
Order.hasMany(OrderedProducts, { foreignKey: "orderId", as: "orderedProducts" })

// Order with User
Order.belongsTo(User, { foreignKey: "userId", as: "user" })
// User.hasMany(Order, { foreignKey: "orderId", as: "user" })

// OrderedProduct with product
Product.hasMany(OrderedProducts, {
    foreignKey: 'productId',
    as: 'orderedProducts',
});

OrderedProducts.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
});


// User.hasMany(Appointment, { foreignKey: "userId", as: "user" });
Appointment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Doctor.hasMany(Appointment, { foreignKey: "doctorId", as: "doctor" });
Appointment.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" })