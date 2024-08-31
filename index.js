require("express-async-errors")
require("dotenv").config();
const express = require("express");
const sequelize = require("./database");
const router = require("./routes");
const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use("/v1/api", router)


async function main() {
    try {
        console.log("in main")
        await sequelize.authenticate();
        await sequelize.sync()

        console.log('Connection has been established successfully.');

        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log("Server is Listening on Port", port)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main()