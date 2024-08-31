const { Sequelize } = require("sequelize")



// const sequelize = new Sequelize('postgres://postgres:pass@example.com:5432/dbname')

const sequelize = new Sequelize(process.env.DB, {
    logging: false
})

// const sequelize = new Sequelize('fyp', 'postgres', 'Muazshah1235#', {
//     host: 'localhost',
//     dialect: "postgres",
//     logging: false
//     // dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });

module.exports = sequelize