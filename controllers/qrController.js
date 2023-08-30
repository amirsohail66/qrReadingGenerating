const qrcode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const QRCodeReader = require('qrcode-reader');
const QRCodeModel = require('../model/QRCode');
const UserModel = require('../model/User');
const {sendEmail} = require('../services/emailServices');
const { validateInput } = require('../middleware/validatInput');

exports.getUserQRCodes = async (req, res) => {
    try {
        const email = req.email;
        const user = await UserModel.findOne({ email });

        // Fetch the details of QR codes based on id
        const qrCodes = await QRCodeModel.find({ _id: { $in: user.qrCodes } });

        // Create an array of objects with ID and data paths
        const qrCodesWithPaths = qrCodes.map(qrCode => ({
            id: qrCode._id,
            data: qrCode.data,
        }));
        res.json({ qrCodes: qrCodesWithPaths });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching QR codes' });
    }
};  

exports.generate = async (req, res) => {
    const qrText = req.body.qrText;
    validateInput(qrText, req, res);

    try {
        const userEmail = req.email;
        const qrCodeDataURL = await qrcode.toDataURL(qrText);

        const filename = `${Date.now()}.png`;
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(filePath, imageBuffer);

        const qrCodeData = {
            filename: filename,
            data: filePath,
        };
        const generatedQRCode = await QRCodeModel.create(qrCodeData);
        const qrId = generatedQRCode._id;

        const userId = req.userId;
        await UserModel.updateOne(
            { _id: userId },
            { $push: { qrCodes: qrId } }
        );

        // creating the array of object for passing in the sendEmail function
        const qrCodes = [{ filename: qrCodeData.filename, data: qrCodeData.data }];
        await sendEmail(userEmail, qrCodes);

        res.setHeader('Content-Type', 'image/png');
        res.end(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'QR code generation and failed' });
    }
};

exports.read = async (req, res) => {
    try {
        const buffer = req.file.buffer; 

        const qrcodeReader = new QRCodeReader();
        qrcodeReader.callback = (err, value) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Image does not contain a valid QR code' });
                return;
            }
            res.json({ result: value.result });
        };
        const jimpImage = await Jimp.read(buffer);
        qrcodeReader.decode(jimpImage.bitmap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'QR code reading failed' });
    }
};