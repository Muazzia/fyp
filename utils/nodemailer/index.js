const nodemailer = require('nodemailer');

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


const sendEmail = async ({ to, subject, text = null, html = null }) => {
    try {
        if (text && html) return { message: null, error: "Either Provide Html Or Text" }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
        };
        if (text) mailOptions.text = text;
        else mailOptions.html = html

        // Send the email
        const res = await transporter.sendMail(mailOptions);
        return { message: res.response, error: null }

    } catch (error) {
        return { message: null, error: error.message }
    }
}


module.exports = { sendEmail }
