const Scan_Data = require("../models/scan_data");
const User = require("../models/user");

// User with Scan_data
User.hasMany(Scan_Data, { foreignKey: "userId", as: "user" })
Scan_Data.belongsTo(User, { foreignKey: "userId", as: "user" })
