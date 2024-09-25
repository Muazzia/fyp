const express = require("express");
const { resWrapper } = require("../utils");
const userRouter = require("./user");
const imageRouter = require("./image");
const { checkJWT, chkDoctorJwt } = require("../middleware/authentication");
const adminRouter = require("./admin");
const nonAdminRoutes = require("./admin/nonAdminRoutes");
const orderRouter = require("./order");
const doctorRouter = require("./doctor");
const appointment = require("./appointment");
const doctorPanelRoutes = require("./doctorpanel");
const router = express.Router();


router.use("/user", userRouter)
router.use("/user/image", checkJWT, imageRouter)

router.use("/admin", adminRouter)
router.use("/order", checkJWT, orderRouter)
router.use("/", checkJWT, nonAdminRoutes)

router.use("/appointment", checkJWT, appointment)

router.use("/doctor", doctorRouter)
router.use("/personal/doctor", chkDoctorJwt, doctorPanelRoutes)


router.use((err, req, res, next) => {
    console.log("internal server error: ", err)
    res.status(500).send(resWrapper("Server Error", 500, null, "Internal Server Error. Try Again"));
})

module.exports = router