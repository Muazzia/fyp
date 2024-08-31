const express = require("express");
const { resWrapper } = require("../utils");
const userRouter = require("./user");
const imageRouter = require("./image");
const { checkJWT } = require("../middleware/authentication");
const router = express.Router();


router.use("/user", userRouter)
router.use("/user/image", checkJWT, imageRouter)


router.use((err, req, res, next) => {
    console.log("internal server error: ", err)
    res.status(500).send(resWrapper("Server Error", 500, null, "Internal Server Error. Try Again"));
})

module.exports = router