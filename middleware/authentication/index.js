const jwt = require("jsonwebtoken");
const { resWrapper } = require("../../utils");

function checkJWT(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send(resWrapper("Unauthorized: Token not available", 401, "", "Unauthorized: Token not available"))
        }
        const accessToken = authHeader.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err.message);
                return res.status(401).send(resWrapper("Unauthorized: Invalid User token", 401, "", "Unauthorized: Invalid User token"))
            } else {
                req.userEmail = decoded.email;
                req.userId = decoded.userId
                // const user = await userModel.findByPk(req.userEmail);
                // if (!user) return res.status(404).send(resWrapper("User dosn't Exist", 404, "", "User not Found"))
                // if (!req.isPassReset && !user.isEmailVerified) return res.status(401).json({ error: "Unauthorized: Email Not Verified" })
                // if (user.isBlocked) return res.status(401).send(resWrapper("Blocked Can't Access", 401, "", "User is Blocked"))
                next();
            }
        });
    } catch (error) {
        console.log("error", error)
        res.status(500).send(resWrapper("Internal Server Error. During Authenticaion in Middleware", 500, "Server Error"));
    }
}


function adminCheckJWT(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            returnres.status(401).send(resWrapper("Unauthorized: Token not available", 401, "", "Unauthorized: Token not available"))

        const accessToken = authHeader.split(" ")[1];
        const adminInfo = jwt.decode(accessToken);

        if (adminInfo?.isAdmin) {
            jwt.verify(accessToken, process.env.JWT_ADMIN_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    console.error("JWT verification failed:", err.message);
                    return res.status(401).send(resWrapper("Unauthorized: Invalid Admin token", 401, null, "Unauthorized: Invalid Admin token"))
                } else {
                    req.userEmail = decoded.email;
                    req.userId = decoded.userId;
                    req.isAdmin = decoded.isAdmin;

                    // const user = await userModel.findByPk(req.userEmail);
                    // if (!user) return res.status(404).send(resWrapper("User dosn't Exist", 404, "", "User not Found"))
                    // if (!req.isPassReset && !user.isEmailVerified) return res.status(401).json({ error: "Unauthorized: Email Not Verified" })
                    // if (user.isBlocked) return res.status(401).send(resWrapper("Blocked Can't Access", 401, "", "User is Blocked"))
                    next();
                }
            });
        } else {
            res.status(403).send(resWrapper("Forbidden: You are not an admin", 403, null, "Forbidden: You are not an admin"))
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(resWrapper("Internal Server Error", 500, "", "Internal Server Error. During Authenticaion in Middleware"))
    }
}


function chkDoctorJwt(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send(resWrapper("Unauthorized: Token not available", 401, "", "Unauthorized: Token not available"))
        }
        const accessToken = authHeader.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_DOCTOR_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err.message);
                return res.status(401).send(resWrapper("Unauthorized: Invalid Doctor token", 401, "", "Unauthorized: Invalid Doctor token"))
            } else {
                req.userEmail = decoded.email;
                req.userId = decoded.doctorId
                // const user = await userModel.findByPk(req.userEmail);
                // if (!user) return res.status(404).send(resWrapper("User dosn't Exist", 404, "", "User not Found"))
                // if (!req.isPassReset && !user.isEmailVerified) return res.status(401).json({ error: "Unauthorized: Email Not Verified" })
                // if (user.isBlocked) return res.status(401).send(resWrapper("Blocked Can't Access", 401, "", "User is Blocked"))
                next();
            }
        });
    } catch (error) {
        console.log("error", error)
        res.status(500).send(resWrapper("Internal Server Error. During Authenticaion in Middleware", 500, "Server Error"));
    }
}


module.exports = { checkJWT, adminCheckJWT, chkDoctorJwt };
