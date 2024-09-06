const jwt = require("jsonwebtoken")
const validator = require("validator")

const resWrapper = (message, status, data, error = null) => {
    if (error) {
        return {
            message,
            status,
            error
        }
    }

    return {
        message,
        status,
        data
    }
};


const generateJwtToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET_KEY
    const token = jwt.sign({ email: user.email, userId: user.id }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token
}

const isValidUuid = (id, res) => {
    if (!validator.isUUID(id)) {
        res.status(400).send(resWrapper("Invalid ID format", 400, null, "ID is not a valid UUID"));
        return false;
    }
    return true;
};



module.exports = {
    resWrapper,
    generateJwtToken,
    isValidUuid
}