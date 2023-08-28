const express = require('express');
const multer = require('multer');

const qrController = require('../controllers/qrController')

const qrRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

qrRoutes.post('/generate',upload.single('qrText'), qrController.generate);

qrRoutes.post('/read', upload.single('qrImage'), qrController.read );


module.exports = qrRoutes;
