const qrcode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require("jimp");
const qrCodeReader = require('qrcode-reader');
const QRCodeModel = require('../model/QRCode'); // Import your MongoDB model
const { verifyToken } = require('../middleware/authToken')
const sendEmail = require('../services/emailServices');

exports.generate = async (req, res) => {
    const qrText = req.body.qrText;
    try {
        const userEmail = req.email;
        const qrCodeDataURL = await qrcode.toDataURL(qrText);  //it wil store image in this formate => data:image/png;base64,iVBORw0KGgoAAAANSUhEUg(Data URL

        // For generating a unique filename
        const filename = `${Date.now()}.png`;
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        // Saving the QR code image to the uploads folder
        const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');  // To remove the prefix data:image/png;base64, from the Data URL
        await fs.writeFile(filePath, base64Data, 'base64');

        // Save the QR code image to mongoDB database 
        const qrCodeData = {
            filename: filename,
            data: base64Data,
        };
        await QRCodeModel.create(qrCodeData);
        console.log(userEmail)

        // Sending the email with QR code as an attachment to the user
        sendEmail.sendEmail(userEmail, filename, filePath);

        res.end('QR is successfully generated :)');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'QR code generation failed' });
    }
};

exports.read = async (req, res) => {
    try {
        // Read the uploaded image and create a buffer
        const buffer = req.file.buffer;

        // Creating an instance of qrcode-reader module
        const qrcodeReader = new qrCodeReader();
        qrcodeReader.callback = (err, value) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Image does not contain a valid QR code' });
                return;
            }
            // Sending the decoded value as a response
            res.json({ result: value.result });
        };

        // Decoding the QR code from the buffer
        const jimpImage = await Jimp.read(buffer);
        qrcodeReader.decode(jimpImage.bitmap);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'QR code reading failed' });
    }
};

//content type -> multipart/form-data, application/json

