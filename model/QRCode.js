const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    filename: String,
    data: String,
});
const QRCodeModel = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCodeModel;
