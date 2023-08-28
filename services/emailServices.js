const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'amir.sohail@brainvire.com',
        pass: process.env.API_KEY,
    },
});

exports.sendEmail = async (userEmail, filename, filePath, req, res) => {
    // console.log(userEmail);
    try {
        const mailOptions = {
            from: 'amir.sohail@brainvire.com',
            to: userEmail,
            subject: 'Your QR Code',
            text: 'Here is your QR code:',
            attachments: [
                {
                    filename: filename,
                    path: filePath,
                },
            ],
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sending Email failed' });
    }
}

