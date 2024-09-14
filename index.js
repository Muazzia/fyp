require("express-async-errors")
require("dotenv").config();
const express = require("express");
const cors = require("cors")
const sequelize = require("./database");
require("./association")
const router = require("./routes");
const app = express();



app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(cors({
    origin: "*"
}))

app.use("/v1/api", router)


async function main() {
    try {
        console.log("in main")
        await sequelize.authenticate();
        await sequelize.sync()

        console.log('Connection has been established successfully.');

        const port = process.env.PORT || 8080;
        app.listen(port, "0.0.0.0", () => {
            console.log("Server is Listening on Port", port)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main()