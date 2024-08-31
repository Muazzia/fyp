const jwt = require("jsonwebtoken")

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


module.exports = {
    resWrapper,
    generateJwtToken
}